<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

// Route principale
Route::get('/', function () { return response('OK'); })->name('home');

// Dashboard
Route::get('/dashboard', function () { return response('OK'); })->name('dashboard');

// Profile settings
Route::get('/settings/profile', function () { return response('OK'); })->name('profile.edit');
Route::put('/settings/profile', function () { return response('OK'); })->name('profile.update');
Route::delete('/settings/profile', function () { return response('OK'); })->name('profile.destroy');

// Password settings
Route::get('/settings/password', function () { return response('OK'); })->name('user-password.edit');
Route::put('/settings/password', function () { return response('OK'); })->name('user-password.update');

// Two-factor authentication
Route::get('/settings/two-factor', function () { return response('OK'); })->name('two-factor.show');

// Confirm password
Route::get('/confirm-password', function () { return response('OK'); })->name('password.confirm');

// Profile (legacy)
Route::get('/user/profile', function () { return response('OK'); })->name('profile.show');