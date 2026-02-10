<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Affiche la liste des utilisateurs pour l'administration.
     */
    public function index()
    {
        // On récupère les utilisateurs avec une pagination
        $users = User::paginate(10)->through(fn ($user) => [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
            'created_at' => $user->created_at->format('d/m/Y'),
        ]);

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
        ]);
    }
}
