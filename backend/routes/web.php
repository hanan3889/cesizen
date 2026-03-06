<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategorieInformationController;
use App\Models\PageInformation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Route principale
Route::get('/', function () {
    $pages = PageInformation::with('categorie')
        ->where('statut', 'publie')
        ->latest()
        ->take(5)
        ->get();
    return Inertia::render('Home', ['pages' => $pages]);
})->name('home');

// Information Pages
Route::get('/informations', function () {
    $pages = PageInformation::with('categorie')->latest()->get();
    return Inertia::render('Information/Index', ['pages' => $pages]);
})->name('information.index');

Route::get('/informations/{page:slug}', function (PageInformation $page) {
    $page->load('categorie');
    return Inertia::render('Information/Show', ['page' => $page]);
})->name('information.show');

Route::post('/register', [AuthController::class, 'register'])->middleware('guest')->name('register');

Route::get('/login', function () {
    return Inertia::render('auth/login');
})->middleware('guest')->name('login');
Route::post('/login', [AuthController::class, 'login'])->middleware('guest');


Route::get('/categories/{categoryId}', [CategorieInformationController::class, 'show'])->name('categories.show');

// --- Routes Administration ---
Route::middleware(['auth', 'verified', 'is_admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/users', function () {
        return Inertia::render('Admin/Users/Index');
    })->name('users.index');
});

Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

Route::get('/dashboard', function () {
    return Inertia::render('dashboard');
})->middleware(['auth'])->name('dashboard');

// Profile settings
Route::get('/settings/profile', function () { return Inertia::render('settings/profile'); })->name('profile.edit');
Route::put('/settings/profile', function () { return response('OK'); })->name('profile.update');
Route::delete('/settings/profile', function () { return response('OK'); })->name('profile.destroy');

// Password settings
Route::get('/settings/password', function () { return Inertia::render('settings/password'); })->name('user-password.edit');
Route::put('/settings/password', function () { return response('OK'); })->name('user-password.update');

// Two-factor authentication
Route::get('/settings/two-factor', function () { return Inertia::render('settings/two-factor'); })->name('two-factor.show');

// Confirm password
Route::get('/confirm-password', function () { return response('OK'); })->name('password.confirm');

// Profile (legacy)
Route::get('/user/profile', function () { return response('OK'); })->name('profile.show');
