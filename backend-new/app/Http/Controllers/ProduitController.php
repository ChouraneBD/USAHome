<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Produit;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class ProduitController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $produits = Produit::with('categorie')->get();

        // Add image URLs
        $produits->each(function ($produit) {
            if ($produit->image) {
                $produit->image_url = Storage::url($produit->image);
            }
        });

        return $produits;
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nom' => 'required|string|max:255',
            'description' => 'nullable|string',
            'prix' => 'required|numeric|min:0',
            'categorie_id' => 'required|exists:categorie_produits,id',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        try {
            $data = $validator->validated();

            // Handle image upload
            if ($request->hasFile('image')) {
                $imagePath = $request->file('image')->store('produits', 'public');
                $data['image'] = $imagePath;
            }

            $produit = Produit::create($data);

            // Load the relationship and add image URL
            $produit->load('categorie');
            if ($produit->image) {
                $produit->image_url = Storage::url($produit->image);
            }

            return response()->json($produit, 201);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        try {
            $produit = Produit::with('categorie')->findOrFail($id);

            // Add image URL
            if ($produit->image) {
                $produit->image_url = Storage::url($produit->image);
            }

            return response()->json($produit);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Produit non trouvé.'], 404);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'nom' => 'required|string|max:255',
            'description' => 'nullable|string',
            'prix' => 'required|numeric|min:0',
            'categorie_id' => 'required|exists:categorie_produits,id',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        try {
            $produit = Produit::findOrFail($id);
            $data = $validator->validated();

            // Handle image upload
            if ($request->hasFile('image')) {
                // Delete old image if exists
                if ($produit->image) {
                    Storage::disk('public')->delete($produit->image);
                }

                $imagePath = $request->file('image')->store('produits', 'public');
                $data['image'] = $imagePath;
            }

            $produit->update($data);

            // Load the relationship and add image URL
            $produit->load('categorie');
            if ($produit->image) {
                $produit->image_url = Storage::url($produit->image);
            }

            return response()->json($produit);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {
            $produit = Produit::findOrFail($id);

            // Delete image if exists
            if ($produit->image) {
                Storage::disk('public')->delete($produit->image);
            }

            $produit->delete();
            return response()->json(['deleted' => true]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
