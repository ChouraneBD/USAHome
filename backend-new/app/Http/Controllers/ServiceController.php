<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Service;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class ServiceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $services = Service::with('type')->get();

        // Add image URLs
        $services->each(function ($service) {
            if ($service->image) {
                $service->image_url = Storage::url($service->image);
            }
        });

        return $services;
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nom' => 'required|string|max:255',
            'description' => 'nullable|string',
            'prix' => 'nullable|numeric|min:0',
            'type_id' => 'required|exists:type_services,id',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        try {
            $data = $validator->validated();

            // Handle image upload
            if ($request->hasFile('image')) {
                $imagePath = $request->file('image')->store('services', 'public');
                $data['image'] = $imagePath;
            }

            $service = Service::create($data);

            // Load the relationship and add image URL
            $service->load('type');
            if ($service->image) {
                $service->image_url = Storage::url($service->image);
            }

            return response()->json($service, 201);
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
            $service = Service::with('type')->findOrFail($id);

            // Add image URL
            if ($service->image) {
                $service->image_url = Storage::url($service->image);
            }

            return response()->json($service);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Service non trouvé.'], 404);
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
            'prix' => 'nullable|numeric|min:0',
            'type_id' => 'required|exists:type_services,id',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        try {
            $service = Service::findOrFail($id);
            $data = $validator->validated();

            // Handle image upload
            if ($request->hasFile('image')) {
                // Delete old image if exists
                if ($service->image) {
                    Storage::disk('public')->delete($service->image);
                }

                $imagePath = $request->file('image')->store('services', 'public');
                $data['image'] = $imagePath;
            }

            $service->update($data);

            // Load the relationship and add image URL
            $service->load('type');
            if ($service->image) {
                $service->image_url = Storage::url($service->image);
            }

            return response()->json($service);
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
            $service = Service::findOrFail($id);

            // Delete image if exists
            if ($service->image) {
                Storage::disk('public')->delete($service->image);
            }

            $service->delete();
            return response()->json(['deleted' => true]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
