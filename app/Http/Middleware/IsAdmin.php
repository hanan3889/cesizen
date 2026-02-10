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

        // Si l'utilisateur n'est pas un admin, on le redirige ou on renvoie une erreur 403.
        // Pour une API, abort(403) est bien. Pour le web, une redirection peut être préférable.
        // abort(403, 'Accès non autorisé.');
        return redirect('/')->with('error', 'Accès non autorisé.');
    }
}
