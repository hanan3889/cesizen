<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\CategorieInformationController;
use App\Http\Controllers\Api\PageInformationController;
use App\Http\Controllers\Api\EvenementVieController;
use App\Http\Controllers\Api\DiagnosticStressController;
use App\Http\Controllers\Api\HistoriqueDiagnosticController;

/*
|--------------------------------------------------------------------------
| API Routes - CesiZen
|--------------------------------------------------------------------------
*/

// Routes publiques (sans authentification)
Route::prefix('v1')->group(function () {
    
    // Authentification
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);

    // Événements de vie (lecture publique)
    Route::get('/evenements', [EvenementVieController::class, 'index']);
    Route::get('/evenements/{id}', [EvenementVieController::class, 'show']);
    Route::get('/evenements/search', [EvenementVieController::class, 'search']);

    // Catégories (lecture publique)
    Route::get('/categories', [CategorieInformationController::class, 'index']);
    Route::get('/categories/{id}', [CategorieInformationController::class, 'show']);

    // Pages d'information (lecture publique - seulement publiées)
    Route::get('/pages', [PageInformationController::class, 'index']);
    Route::get('/pages/{id}', [PageInformationController::class, 'show']);
});

// Routes protégées (avec authentification)
Route::prefix('v1')->middleware('auth:sanctum')->group(function () {
    
    // Authentification (utilisateur connecté)
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);
    Route::post('/change-password', [AuthController::class, 'changePassword']);

    // Diagnostics de stress
    Route::prefix('diagnostics')->group(function () {
        Route::get('/', [DiagnosticStressController::class, 'index']);
        Route::post('/', [DiagnosticStressController::class, 'store']);
        Route::get('/statistiques', [DiagnosticStressController::class, 'statistiques']);
        Route::get('/recents', [DiagnosticStressController::class, 'recents']);
        Route::get('/{id}', [DiagnosticStressController::class, 'show']);
        Route::delete('/{id}', [DiagnosticStressController::class, 'destroy']);
    });

    // Historique des diagnostics
    Route::prefix('historique')->group(function () {
        Route::get('/', [HistoriqueDiagnosticController::class, 'index']);
        Route::get('/recent', [HistoriqueDiagnosticController::class, 'recent']);
        Route::post('/', [HistoriqueDiagnosticController::class, 'store']);
        Route::delete('/', [HistoriqueDiagnosticController::class, 'destroy']);
    });

    // Gestion des utilisateurs
    Route::prefix('users')->group(function () {
        Route::get('/', [UserController::class, 'index']); 
        Route::get('/statistiques', [UserController::class, 'statistiques']); 
        Route::get('/{id}', [UserController::class, 'show']); 
        Route::put('/{id}', [UserController::class, 'update']); 
        Route::delete('/{id}', [UserController::class, 'destroy']); 
        Route::post('/{id}/reset-password', [UserController::class, 'resetPassword']); 
    });

    // Gestion des pages (admin seulement pour create/update/delete)
    Route::prefix('pages')->group(function () {
        Route::post('/', [PageInformationController::class, 'store']); 
        Route::put('/{id}', [PageInformationController::class, 'update']); 
        Route::delete('/{id}', [PageInformationController::class, 'destroy']); 
        Route::post('/{id}/publier', [PageInformationController::class, 'publier']); 
        Route::post('/{id}/archiver', [PageInformationController::class, 'archiver']); 
    });

    // Gestion des catégories (admin seulement pour create/update/delete)
    Route::prefix('categories')->group(function () {
        Route::post('/', [CategorieInformationController::class, 'store']); 
        Route::put('/{id}', [CategorieInformationController::class, 'update']); 
        Route::delete('/{id}', [CategorieInformationController::class, 'destroy']); 
    });
});

// Route de test
Route::get('/v1/test', function () {
    return response()->json([
        'message' => 'API CesiZen fonctionnelle',
        'version' => '1.0',
        'timestamp' => now(),
    ]);
});
