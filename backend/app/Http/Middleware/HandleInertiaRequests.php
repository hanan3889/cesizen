<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Middleware conservé pour compatibilité, désactivé dans bootstrap/app.php.
 * Le projet utilise React Router (SPA) — Inertia a été supprimé.
 */
class HandleInertiaRequests
{
    public function handle(Request $request, Closure $next): Response
    {
        return $next($request);
    }
}
