<?php

use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\CategorieInformationController;
use App\Http\Controllers\PageInformationController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;



Route::get('/', function () {
    return Inertia::render('Home');
});

Route::get('/register', [RegisteredUserController::class, 'create'])->middleware('guest')->name('register');

Route::get('/login', function () {
    return Inertia::render('auth/login');
})->middleware('guest')->name('login');

Route::get('/informations', function () {
    return Inertia::render('Informations');
})->name('informations');

Route::get('/categories/{categoryId}', [CategorieInformationController::class, 'show'])->name('categories.show');

// --- Routes Administration ---
Route::middleware(['auth', 'verified', 'is_admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/users', function () {
        return Inertia::render('Admin/Users/Index');
    })->name('users.index');
});

Route::post('/logout', function (Request $request) {
    if (Auth::user()) {
        Auth::user()->tokens()->delete();
    }

    Auth::guard('web')->logout();

    $request->session()->invalidate();
    $request->session()->regenerateToken();

    return response()->json(['message' => 'Logged out successfully']);
})->name('logout');

Route::get('/dashboard', function () {
    return Inertia::render('dashboard');
})->middleware(['auth'])->name('dashboard');
