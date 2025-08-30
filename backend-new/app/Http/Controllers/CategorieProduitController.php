<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\CategorieProduit;

class CategorieProduitController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return CategorieProduit::all();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $cat = CategorieProduit::create($request->all());
        return response()->json($cat, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        return CategorieProduit::findOrFail($id);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $cat = CategorieProduit::findOrFail($id);
        $cat->update($request->all());
        return $cat;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        CategorieProduit::destroy($id);
        return response()->json(['deleted' => true]);
    }
}
