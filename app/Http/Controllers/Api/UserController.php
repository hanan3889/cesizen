<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    /**
     * Liste de tous les utilisateurs
     */
    public function index(Request $request)
    {
        if (!$request->user()->isAdmin()) {
            return response()->json([
                'message' => 'Action non autorisée',
            ], 403);
        }

        $query = User::query();

        // Filtrer par rôle si demandé
        if ($request->has('role')) {
            $query->where('role', $request->role);
        }

        $users = $query->orderBy('created_at', 'desc')->paginate(20);

        return response()->json($users);
    }

    /**
     * Afficher un utilisateur spécifique
     */
    public function show(Request $request, $id)
    {
        // Seul l'admin ou l'utilisateur lui-même peut voir le profil
        if (!$request->user()->isAdmin() && $request->user()->id != $id) {
            return response()->json([
                'message' => 'Action non autorisée',
            ], 403);
        }

        $user = User::findOrFail($id);

        $userData = [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
            'created_at' => $user->created_at,
        ];

        // Ajouter les statistiques si c'est l'utilisateur lui-même
        if ($request->user()->id == $id) {
            $userData['statistiques'] = [
                'nombre_diagnostics' => $user->diagnostics()->count(),
                'dernier_diagnostic' => $user->diagnostics()->latest('date')->first(),
            ];
        }

        return response()->json([
            'user' => $userData,
        ]);
    }

    /**
     * Mettre à jour un utilisateur
     */
    public function update(Request $request, $id)
    {
        if (!$request->user()->isAdmin()) {
            return response()->json([
                'message' => 'Action non autorisée',
            ], 403);
        }

        $user = User::findOrFail($id);

        $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $id,
            'role' => 'sometimes|in:utilisateur,administrateur',
        ]);

        $user->update($request->only(['name', 'email', 'role']));

        return response()->json([
            'message' => 'Utilisateur mis à jour',
            'user' => $user,
        ]);
    }

    /**
     * Supprimer un utilisateur
     */
    public function destroy(Request $request, $id)
    {
        if (!$request->user()->isAdmin()) {
            return response()->json([
                'message' => 'Action non autorisée',
            ], 403);
        }

        // Empêcher la suppression de son propre compte
        if ($request->user()->id == $id) {
            return response()->json([
                'message' => 'Vous ne pouvez pas supprimer votre propre compte',
            ], 422);
        }

        $user = User::findOrFail($id);
        $user->delete();

        return response()->json([
            'message' => 'Utilisateur supprimé avec succès',
        ]);
    }

    /**
     * Réinitialiser le mot de passe 
     */
    public function resetPassword(Request $request, $id)
    {
        if (!$request->user()->isAdmin()) {
            return response()->json([
                'message' => 'Action non autorisée',
            ], 403);
        }

        $request->validate([
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::findOrFail($id);
        $user->update([
            'password' => Hash::make($request->password),
        ]);

        return response()->json([
            'message' => 'Mot de passe réinitialisé avec succès',
        ]);
    }

    /**
     * Statistiques générales
     */
    public function statistiques(Request $request)
    {
        if (!$request->user()->isAdmin()) {
            return response()->json([
                'message' => 'Action non autorisée',
            ], 403);
        }

        $stats = [
            'total_utilisateurs' => User::utilisateurs()->count(),
            'total_administrateurs' => User::administrateurs()->count(),
            'nouveaux_utilisateurs_mois' => User::where('created_at', '>=', now()->subMonth())->count(),
        ];

        return response()->json([
            'statistiques' => $stats,
        ]);
    }
}
