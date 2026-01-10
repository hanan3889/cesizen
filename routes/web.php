<?php

use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\CategorieInformationController;
use App\Http\Controllers\PageInformationController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;



Route::get('/', function () {
    return Inertia::render('Home');
});

Route::get('/register', [RegisteredUserController::class, 'create'])->middleware('guest')->name('register');

Route::get('/login', function () {
    return Inertia::render('auth/login');
})->middleware('guest')->name('login');

Route::get('/informations', [PageInformationController::class, 'index'])->name('informations');

Route::get('/categories/{category}', [CategorieInformationController::class, 'show'])->name('categories.show');




Route::get('/dashboard', function () {
    return Inertia::render('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');
