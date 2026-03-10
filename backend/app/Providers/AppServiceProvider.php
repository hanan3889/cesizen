<?php

namespace App\Providers;

use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        // Redirige le lien de reset vers le frontend React
        ResetPassword::createUrlUsing(function ($user, string $token) {
            $frontendUrl = rtrim(config('app.frontend_url', config('app.url')), '/');
            return $frontendUrl . '/reset-password?token=' . $token . '&email=' . urlencode($user->email);
        });
    }
}
