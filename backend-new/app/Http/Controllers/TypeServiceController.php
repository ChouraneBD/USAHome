<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\TypeService;

class TypeServiceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return TypeService::all();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $type = TypeService::create($request->all());
        return response()->json($type, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        return TypeService::findOrFail($id);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $type = TypeService::findOrFail($id);
        $type->update($request->all());
        return $type;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        TypeService::destroy($id);
        return response()->json(['deleted' => true]);
    }
}
