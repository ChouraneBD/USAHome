<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ServiceType;
use Illuminate\Support\Facades\Validator;

class ServiceTypeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $serviceTypes = ServiceType::withCount('services')->get();
        return response()->json($serviceTypes);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:service_types,name',
            'description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        try {
            $serviceType = ServiceType::create($validator->validated());
            return response()->json($serviceType, 201);
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
            $serviceType = ServiceType::with('services')->findOrFail($id);
            return response()->json($serviceType);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Service type non trouvé.'], 404);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:service_types,name,' . $id,
            'description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        try {
            $serviceType = ServiceType::findOrFail($id);
            $serviceType->update($validator->validated());
            return response()->json($serviceType);
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
            $serviceType = ServiceType::findOrFail($id);

            // Check if service type has associated services
            if ($serviceType->services()->count() > 0) {
                return response()->json([
                    'error' => 'Impossible de supprimer ce type de service car il contient des services associés.'
                ], 422);
            }

            $serviceType->delete();
            return response()->json(['deleted' => true]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}