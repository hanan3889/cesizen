<?php

use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Api\CategorieInformationController;
use App\Models\PageInformation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Http\Controllers\PasswordResetLinkController;
use Laravel\Fortify\Http\Controllers\NewPasswordController;

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

Route::get('/register', [RegisteredUserController::class, 'create'])->middleware('guest')->name('register');
Route::post('/register', [RegisteredUserController::class, 'store'])->middleware('guest')->name('register.store');

Route::get('/login', function () {
    return Inertia::render('auth/login');
})->middleware('guest')->name('login');


Route::get('/categories/{categoryId}', [CategorieInformationController::class, 'show'])->name('categories.show');

// --- Routes Administration ---
Route::middleware(['auth', 'verified', 'is_admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/users', function () {
        return Inertia::render('Admin/Users/Index');
    })->name('users.index');
});

Route::get('/dashboard', function () {
    return Inertia::render('dashboard');
})->middleware(['auth'])->name('dashboard');

// Password Reset Routes...
Route::get('forgot-password', [PasswordResetLinkController::class, 'create'])
                ->middleware('guest')
                ->name('password.request');

Route::post('forgot-password', [PasswordResetLinkController::class, 'store'])
                ->middleware('guest')
                ->name('password.email');

Route::get('reset-password/{token}', [NewPasswordController::class, 'create'])
                ->middleware('guest')
                ->name('password.reset');

Route::post('reset-password', [NewPasswordController::class, 'store'])
                ->middleware('guest')
                ->name('password.update');

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
