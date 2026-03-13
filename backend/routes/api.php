<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategorieInformationController;
use App\Http\Controllers\Api\DiagnosticConfigController;
use App\Http\Controllers\Api\DiagnosticStressController;
use App\Http\Controllers\Api\EvenementVieController;
use App\Http\Controllers\Api\PageInformationController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\V1\UserController as AdminUserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/reset-password', [AuthController::class, 'resetPasswordComplete']);

    // Public API routes
    Route::get('diagnostic-config', [DiagnosticConfigController::class, 'index']);
    Route::get('pages/latest', [PageInformationController::class, 'latest']);
    Route::get('pages/slug/{slug}', [PageInformationController::class, 'showBySlug']);
    Route::apiResource('pages', PageInformationController::class)->only(['index', 'show']);
    Route::apiResource('categories', CategorieInformationController::class)->only(['index', 'show']);
    Route::get('evenements/search', [EvenementVieController::class, 'search']);
    Route::apiResource('evenements', EvenementVieController::class)->only(['index', 'show']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);
        Route::put('/profile', [AuthController::class, 'updateProfile']);
        Route::put('/password', [AuthController::class, 'changePassword']);
        Route::get('/me/export', [AuthController::class, 'exportData']);
        Route::delete('/me', [AuthController::class, 'deleteAccount']);

        // Routes utilisateur authentifié (diagnostic)
        Route::get('diagnostics/statistiques', [DiagnosticStressController::class, 'statistiques']);
        Route::get('diagnostics/recents', [DiagnosticStressController::class, 'recents']);
        Route::apiResource('diagnostics', DiagnosticStressController::class);

        // --- Routes réservées aux administrateurs ---
        Route::middleware('is_admin')->group(function () {
            // Gestion des pages d'information (CRUD admin)
            Route::apiResource('pages', PageInformationController::class)->except(['index', 'show']);
            Route::post('pages/{id}/publier', [PageInformationController::class, 'publier']);
            Route::post('pages/{id}/archiver', [PageInformationController::class, 'archiver']);

            // Gestion des catégories (CRUD admin)
            Route::apiResource('categories', CategorieInformationController::class)->except(['index', 'show']);

            // Configuration du diagnostic de stress
            Route::put('diagnostic-config/{niveau}', [DiagnosticConfigController::class, 'update']);
            Route::delete('diagnostic-config/{niveau}', [DiagnosticConfigController::class, 'destroy']);

            // Gestion des événements de vie (CRUD admin)
            Route::apiResource('evenements', EvenementVieController::class)->except(['index', 'show']);

            // Gestion des utilisateurs
            Route::post('users/{user}/reset-password', [UserController::class, 'resetPassword']);
            Route::get('users/statistiques', [UserController::class, 'statistiques']);
            Route::apiResource('users', UserController::class);
        });

        // --- Admin API Routes ---
        Route::middleware('is_admin')->prefix('admin')->name('api.admin.')->group(function () {
            Route::get('users', [AdminUserController::class, 'index'])->name('users.index');
        });
    });
});
