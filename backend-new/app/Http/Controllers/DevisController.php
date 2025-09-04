<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Devis;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Mail;

class DevisController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $devis = Devis::orderBy('created_at', 'desc')->get();

        return response()->json($devis);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nom' => 'required|string|max:255','email' => 'required|email|max:255',
            'telephone' => 'nullable|string|max:20',
            'objet' => 'required|string|max:255',
            'message' => 'required|string',
            'type_devis' => 'required|in:service,product,both',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $devis = Devis::create([
                'nom' => $request->nom,
                'email' => $request->email,
                'telephone' => $request->telephone,
                'objet' => $request->objet,
                'message' => $request->message,
                'type_devis' => $request->type_devis,
                'statut' => 'nouveau'
            ]);

            // Here you could send an email notification
            // Mail::to('admin@usahome.ma')->send(new NewDevisNotification($devis));

            return response()->json([
                'success' => true,
                'message' => 'Votre demande de devis a été envoyée avec succès! Nous vous contacterons bientôt.',
                'data' => $devis
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Une erreur est survenue lors de l\'envoi de votre demande.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        try {
            $devis = Devis::findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $devis
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Demande de devis non trouvée.'
            ], 404);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'statut' => 'sometimes|in:nouveau,en_cours,traite,annule',
            'nom' => 'sometimes|string|max:255','email' => 'sometimes|email|max:255',
            'telephone' => 'sometimes|nullable|string|max:20',
            'objet' => 'sometimes|string|max:255',
            'message' => 'sometimes|string',
            'type_devis' => 'sometimes|in:service,product,both',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $devis = Devis::findOrFail($id);
            $devis->update($validator->validated());

            return response()->json([
                'success' => true,
                'message' => 'Demande de devis mise à jour avec succès.',
                'data' => $devis
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la mise à jour.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {
            $devis = Devis::findOrFail($id);
            $devis->delete();

            return response()->json([
                'success' => true,
                'message' => 'Demande de devis supprimée avec succès.'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get statistics for the dashboard
     */
    public function statistics()
    {
        try {
            $total = Devis::count();
            $nouveau = Devis::where('statut', 'nouveau')->count();
            $enCours = Devis::where('statut', 'en_cours')->count();
            $traite = Devis::where('statut', 'traite')->count();

            return response()->json([
                'success' => true,
                'data' => [
                    'total' => $total,
                    'nouveau' => $nouveau,
                    'en_cours' => $enCours,
                    'traite' => $traite
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des statistiques.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}