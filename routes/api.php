<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategorieInformationController;
use App\Http\Controllers\Api\DiagnosticStressController;
use App\Http\Controllers\Api\EvenementVieController;
use App\Http\Controllers\Api\HistoriqueDiagnosticController;
use App\Http\Controllers\Api\PageInformationController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);
        Route::put('/profile', [AuthController::class, 'updateProfile']);
        Route::put('/password', [AuthController::class, 'changePassword']);

        Route::apiResource('categories', CategorieInformationController::class);
        Route::get('diagnostics/statistiques', [DiagnosticStressController::class, 'statistiques']);
        Route::get('diagnostics/recents', [DiagnosticStressController::class, 'recents']);
        Route::apiResource('diagnostics', DiagnosticStressController::class);
        Route::get('evenements/search', [EvenementVieController::class, 'search']);
        Route::apiResource('evenements', EvenementVieController::class)->only(['index', 'show']);
        Route::get('historiques/recent', [HistoriqueDiagnosticController::class, 'recent']);
        Route::apiResource('historiques', HistoriqueDiagnosticController::class)->except(['update', 'show']);
        Route::post('pages/{id}/publier', [PageInformationController::class, 'publier']);
        Route::post('pages/{id}/archiver', [PageInformationController::class, 'archiver']);
        Route::apiResource('pages', PageInformationController::class);
        Route::post('users/{id}/reset-password', [UserController::class, 'resetPassword']);
        Route::get('users/statistiques', [UserController::class, 'statistiques']);
        Route::apiResource('users', UserController::class);
    });
});
