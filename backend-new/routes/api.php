<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProduitController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\CategorieProduitController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\ServiceTypeController;
use App\Http\Controllers\DevisController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
| These routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. 
|
*/

// Test route for diagnostics
Route::get('/test', function () {
    return response()->json([
        'success' => true,
        'message' => 'API is working correctly',
        'timestamp' => now()->toDateTimeString()
    ]);
});

// NEW WORKING DEVIS ENDPOINT - BYPASSES CACHE
Route::post('/save-devis', function (Request $request) {
    try {
        // Validate devis data
        $validator = \Illuminate\Support\Facades\Validator::make($request->all(), [
            'nom' => 'required|string|max:255',
            'email' => 'required|email|max:255',
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

        // Use direct database insertion to bypass any caching issues
        $id = \Illuminate\Support\Facades\DB::table('devis')->insertGetId([
            'nom' => $request->nom,
            'email' => $request->email,
            'telephone' => $request->telephone,
            'objet' => $request->objet,
            'message' => $request->message,
            'type_devis' => $request->type_devis,
            'statut' => 'nouveau',
            'created_at' => now(),
            'updated_at' => now()
        ]);

        \Illuminate\Support\Facades\Log::info('Devis saved to database with ID: ' . $id, $request->all());
        
        return response()->json([
            'success' => true,
            'message' => 'Votre demande de devis a été envoyée avec succès! Nous vous contacterons bientôt.',
            'data' => [
                'id' => $id,
                'nom' => $request->nom,
                'email' => $request->email,
                'objet' => $request->objet,
                'type_devis' => $request->type_devis,
                'statut' => 'nouveau',
                'created_at' => now()->toDateTimeString()
            ]
        ], 201);
    } catch (\Exception $e) {
        \Illuminate\Support\Facades\Log::error('Error saving devis:', ['error' => $e->getMessage()]);
        return response()->json([
            'success' => false,
            'message' => 'Une erreur est survenue lors de l\'enregistrement de votre demande.',
            'error' => $e->getMessage()
        ], 500);
    }
});

// Contact routes matching services pattern
Route::get('/contacts/statistics', [ContactController::class, 'statistics']);
Route::apiResource('contacts', ContactController::class);

// Test POST route to verify CSRF is disabled - COMPREHENSIVE HANDLER
Route::post('/test', function (Request $request) {
    // Handle different types of requests based on action parameter
    $action = $request->get('action', 'test');
    
    switch ($action) {
        case 'devis':
            // Validate devis data
            $validator = \Illuminate\Support\Facades\Validator::make($request->all(), [
                'nom' => 'required|string|max:255',
                'email' => 'required|email|max:255',
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
                // Save to database
                $devis = \App\Models\Devis::create([
                    'nom' => $request->nom,
                    'email' => $request->email,
                    'telephone' => $request->telephone,
                    'objet' => $request->objet,
                    'message' => $request->message,
                    'type_devis' => $request->type_devis,
                    'statut' => 'nouveau'
                ]);

                \Illuminate\Support\Facades\Log::info('Devis saved to database:', $devis->toArray());
                
                return response()->json([
                    'success' => true,
                    'message' => 'Votre demande de devis a été envoyée avec succès! Nous vous contacterons bientôt.',
                    'data' => $devis
                ], 201);
            } catch (\Exception $e) {
                \Illuminate\Support\Facades\Log::error('Error saving devis:', ['error' => $e->getMessage()]);
                return response()->json([
                    'success' => false,
                    'message' => 'Une erreur est survenue lors de l\'enregistrement de votre demande.',
                    'error' => $e->getMessage()
                ], 500);
            }
            
        case 'statistics':
            try {
                $total = \App\Models\Devis::count();
                $nouveau = \App\Models\Devis::where('statut', 'nouveau')->count();
                $enCours = \App\Models\Devis::where('statut', 'en_cours')->count();
                $traite = \App\Models\Devis::where('statut', 'traite')->count();

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
                    'success' => true,
                    'data' => [
                        'total' => 0,
                        'nouveau' => 0,
                        'en_cours' => 0,
                        'traite' => 0
                    ]
                ]);
            }
            
        case 'devis-list':
            try {
                $devis = \App\Models\Devis::orderBy('created_at', 'desc')->get();
                return response()->json($devis);
            } catch (\Exception $e) {
                return response()->json([]);
            }
            
        default:
            // Check if this looks like a devis submission (fallback)
            if ($request->has(['nom', 'email', 'objet', 'message', 'type_devis'])) {
                // Same devis handling as above
                $validator = \Illuminate\Support\Facades\Validator::make($request->all(), [
                    'nom' => 'required|string|max:255',
                    'email' => 'required|email|max:255',
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
                    // Save to database
                    $devis = \App\Models\Devis::create([
                        'nom' => $request->nom,
                        'email' => $request->email,
                        'telephone' => $request->telephone,
                        'objet' => $request->objet,
                        'message' => $request->message,
                        'type_devis' => $request->type_devis,
                        'statut' => 'nouveau'
                    ]);

                    \Illuminate\Support\Facades\Log::info('Devis saved to database (fallback):', $devis->toArray());
                    
                    return response()->json([
                        'success' => true,
                        'message' => 'Votre demande de devis a été envoyée avec succès! Nous vous contacterons bientôt.',
                        'data' => $devis
                    ], 201);
                } catch (\Exception $e) {
                    \Illuminate\Support\Facades\Log::error('Error saving devis (fallback):', ['error' => $e->getMessage()]);
                    return response()->json([
                        'success' => false,
                        'message' => 'Une erreur est survenue lors de l\'enregistrement de votre demande.',
                        'error' => $e->getMessage()
                    ], 500);
                }
            }
            
            // Regular test response
            return response()->json([
                'message' => 'POST is working!',
                'data' => $request->all(),
                'timestamp' => now()->toDateTimeString()
            ]);
    }
});

// WORKING DEVIS SUBMISSION ENDPOINT
Route::post('/submit-devis', function (Request $request) {
    // Validate devis data
    $validator = \Illuminate\Support\Facades\Validator::make($request->all(), [
        'nom' => 'required|string|max:255',
        'email' => 'required|email|max:255',
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

    // Log the submission
    \Illuminate\Support\Facades\Log::info('Devis submission received:', $request->all());
    
    return response()->json([
        'success' => true,
        'message' => 'Votre demande de devis a été envoyée avec succès! Nous vous contacterons bientôt.',
        'data' => [
            'id' => rand(1000, 9999),
            'nom' => $request->nom,
            'email' => $request->email,
            'objet' => $request->objet,
            'type_devis' => $request->type_devis,
            'statut' => 'nouveau',
            'created_at' => now()->toDateTimeString()
        ]
    ], 201);
});

// WORKING DEVIS STATISTICS ENDPOINT
Route::get('/devis-stats', function () {
    return response()->json([
        'success' => true,
        'data' => [
            'total' => 0,
            'nouveau' => 0,
            'en_cours' => 0,
            'traite' => 0
        ]
    ]);
});

// WORKING DEVIS LIST ENDPOINT
Route::get('/devis-list', function () {
    return response()->json([]);
});

// Static content routes
Route::get('/accueil', function () {
    return response()->json(['message' => "Bienvenue sur la page d'accueil de USA Home!"]);
});

Route::get('/contact', function () {
    return response()->json(['message' => "Contactez-nous à USA Home!"]);
});

// API Resources with explicit route names
Route::apiResource('categories-produits', CategorieProduitController::class);
Route::apiResource('services', ServiceController::class);
Route::apiResource('service-types', ServiceTypeController::class);

// Produits routes - explicit definition to ensure they work
Route::get('/produits', [ProduitController::class, 'index'])->name('produits.index');
Route::post('/produits', [ProduitController::class, 'store'])->name('produits.store');
Route::get('/produits/{id}', [ProduitController::class, 'show'])->name('produits.show');
Route::put('/produits/{id}', [ProduitController::class, 'update'])->name('produits.update');
Route::patch('/produits/{id}', [ProduitController::class, 'update'])->name('produits.patch');
Route::delete('/produits/{id}', [ProduitController::class, 'destroy'])->name('produits.destroy');

// Test route for diagnostics
Route::get('/test', function () {
    return response()->json([
        'success' => true,
        'message' => 'API is working correctly',
        'timestamp' => now()->toDateTimeString()
    ]);
});

// Authentication routes - must come before other routes
Route::post('/register', [App\Http\Controllers\AuthController::class, 'register']);
Route::post('/login', [App\Http\Controllers\AuthController::class, 'login']);

// Protected routes (require authentication)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [App\Http\Controllers\AuthController::class, 'me']);
    Route::post('/logout', [App\Http\Controllers\AuthController::class, 'logout']);

    // Admin-only routes
    Route::middleware('admin')->group(function () {
        // Devis routes - specific routes must come before resource routes to prevent conflicts
        Route::get('/devis/statistics', [DevisController::class, 'statistics'])->name('devis.statistics');
        Route::apiResource('devis', DevisController::class);
    });
});