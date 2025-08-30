<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProduitController;
use App\Http\Controllers\CategorieProduitController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\TypeServiceController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
| These routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. 
|
*/

// Test route
Route::get('/test', function () {
    return response()->json([
        'message' => 'API is working!',
        'timestamp' => now()->toDateTimeString(),
        'method' => 'GET'
    ]);
});

// Test POST route to verify CSRF is disabled
Route::post('/test', function (Request $request) {
    return response()->json([
        'message' => 'POST is working!',
        'data' => $request->all(),
        'timestamp' => now()->toDateTimeString()
    ]);
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
Route::apiResource('types-services', TypeServiceController::class);
Route::apiResource('services', ServiceController::class);

// Produits routes - explicit definition to ensure they work
Route::get('/produits', [ProduitController::class, 'index'])->name('produits.index');
Route::post('/produits', [ProduitController::class, 'store'])->name('produits.store');
Route::get('/produits/{id}', [ProduitController::class, 'show'])->name('produits.show');
Route::put('/produits/{id}', [ProduitController::class, 'update'])->name('produits.update');
Route::patch('/produits/{id}', [ProduitController::class, 'update'])->name('produits.patch');
Route::delete('/produits/{id}', [ProduitController::class, 'destroy'])->name('produits.destroy');