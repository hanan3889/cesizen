<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class IsAdmin
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->user() && $request->user()->role === 'administrateur') {
            return $next($request);
        }

        // Pour une API, on retourne une réponse JSON avec un statut 403.
        return response()->json(['message' => 'Accès non autorisé.'], 403);
    }
}
