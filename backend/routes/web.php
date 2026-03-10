<?php

use Illuminate\Support\Facades\Route;

// Toutes les routes sont gérées par React Router (SPA)
Route::get('/{any}', function () {
    return view('app');
})->where('any', '.*');