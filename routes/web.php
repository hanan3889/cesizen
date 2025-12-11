<?php

use Illuminate\Support\Facades\Route;

/**
 * Route de test Tailwind (optionnel - à supprimer en production)
 */
Route::get('/test-tailwind', function () {
    return view('test');
});

/**
 * Route principale pour l'application React
 * Capture toutes les routes et les renvoie vers React Router
 */
Route::get('/{any}', function () {
    return view('app');
})->where('any', '^(?!api|test-tailwind).*$');