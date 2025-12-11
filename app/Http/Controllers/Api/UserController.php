<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    /**
     * @OA\Get(
     *     path="/users",
     *     summary="Liste de tous les utilisateurs",
     *     tags={"Utilisateurs"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="role",
     *         in="query",
     *         description="Filtrer par rôle (utilisateur, administrateur)",
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Liste des utilisateurs",
     *         @OA\JsonContent(type="array", @OA\Items(type="object"))
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="Action non autorisée"
     *     )
     * )
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
     * @OA\Get(
     *     path="/users/{id}",
     *     summary="Afficher un utilisateur spécifique",
     *     tags={"Utilisateurs"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID de l'utilisateur",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Détails de l'utilisateur",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="user", type="object")
     *         )
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="Action non autorisée"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Utilisateur non trouvé"
     *     )
     * )
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
     * @OA\Put(
     *     path="/users/{id}",
     *     summary="Mettre à jour un utilisateur",
     *     tags={"Utilisateurs"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID de l'utilisateur",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         @OA\JsonContent(
     *             @OA\Property(property="name", type="string", example="John Doe"),
     *             @OA\Property(property="email", type="string", format="email", example="john.doe@example.com"),
     *             @OA\Property(property="role", type="string", example="utilisateur", enum={"utilisateur", "administrateur"})
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Utilisateur mis à jour",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string"),
     *             @OA\Property(property="user", type="object")
     *         )
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="Action non autorisée"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Utilisateur non trouvé"
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Validation des données échouée"
     *     )
     * )
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
     * @OA\Delete(
     *     path="/users/{id}",
     *     summary="Supprimer un utilisateur",
     *     tags={"Utilisateurs"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID de l'utilisateur",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Utilisateur supprimé avec succès",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string")
     *         )
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="Action non autorisée"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Utilisateur non trouvé"
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Impossible de supprimer son propre compte"
     *     )
     * )
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
     * @OA\Post(
     *     path="/users/{id}/reset-password",
     *     summary="Réinitialiser le mot de passe",
     *     tags={"Utilisateurs"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID de l'utilisateur",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"password", "password_confirmation"},
     *             @OA\Property(property="password", type="string", format="password", example="new-password"),
     *             @OA\Property(property="password_confirmation", type="string", format="password", example="new-password")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Mot de passe réinitialisé avec succès",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string")
     *         )
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="Action non autorisée"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Utilisateur non trouvé"
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Validation des données échouée"
     *     )
     * )
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
     * @OA\Get(
     *     path="/users/statistiques",
     *     summary="Statistiques générales",
     *     tags={"Utilisateurs"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Statistiques générales",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="statistiques", type="object")
     *         )
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="Action non autorisée"
     *     )
     * )
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
