<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    /**
     * @OA\Get(
     *     path="/users",
     *     summary="Liste de tous les utilisateurs",
     *     tags={"Utilisateurs"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(response=200, description="Liste des utilisateurs"),
     *     @OA\Response(response=403, description="Action non autorisée")
     * )
     */
    public function index()
    {
        return response()->json([
            'data' => User::paginate(15),
        ]);
    }

    /**
     * @OA\Post(
     *     path="/users",
     *     summary="Créer un nouvel utilisateur",
     *     tags={"Utilisateurs"},
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"name", "email", "password", "role"},
     *             @OA\Property(property="name", type="string", example="John Doe"),
     *             @OA\Property(property="email", type="string", format="email", example="john.doe@example.com"),
     *             @OA\Property(property="password", type="string", format="password", example="password123"),
     *             @OA\Property(property="password_confirmation", type="string", format="password", example="password123"),
     *             @OA\Property(property="role", type="string", enum={"utilisateur", "administrateur"})
     *         )
     *     ),
     *     @OA\Response(response=201, description="Utilisateur créé"),
     *     @OA\Response(response=403, description="Action non autorisée"),
     *     @OA\Response(response=422, description="Validation échouée")
     * )
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'role' => ['required', Rule::in(['utilisateur', 'administrateur'])],
        ]);

        $user = User::create($validatedData);

        return response()->json(['user' => $user], 201);
    }

    /**
     * @OA\Get(
     *     path="/users/{id}",
     *     summary="Afficher un utilisateur",
     *     tags={"Utilisateurs"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Détails de l'utilisateur"),
     *     @OA\Response(response=403, description="Action non autorisée"),
     *     @OA\Response(response=404, description="Utilisateur non trouvé")
     * )
     */
    public function show(User $user)
    {
        return response()->json(['user' => $user]);
    }

    /**
     * @OA\Put(
     *     path="/users/{id}",
     *     summary="Mettre à jour un utilisateur",
     *     tags={"Utilisateurs"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\RequestBody(
     *         @OA\JsonContent(
     *             @OA\Property(property="name", type="string"),
     *             @OA\Property(property="email", type="string", format="email"),
     *             @OA\Property(property="role", type="string", enum={"utilisateur", "administrateur"})
     *         )
     *     ),
     *     @OA\Response(response=200, description="Utilisateur mis à jour"),
     *     @OA\Response(response=403, description="Action non autorisée"),
     *     @OA\Response(response=404, description="Utilisateur non trouvé")
     * )
     */
    public function update(Request $request, User $user)
    {
        $validatedData = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => ['sometimes', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'role' => ['sometimes', Rule::in(['utilisateur', 'administrateur'])],
        ]);

        $user->update($validatedData);

        return response()->json(['user' => $user]);
    }

    /**
     * @OA\Delete(
     *     path="/users/{id}",
     *     summary="Supprimer un utilisateur",
     *     tags={"Utilisateurs"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Utilisateur supprimé"),
     *     @OA\Response(response=403, description="Action non autorisée"),
     *     @OA\Response(response=404, description="Utilisateur non trouvé")
     * )
     */
    public function destroy(User $user)
    {
        $user->delete();
        return response()->json(['message' => 'Utilisateur supprimé avec succès']);
    }

    /**
     * @OA\Post(
     *     path="/users/{id}/reset-password",
     *     summary="Réinitialiser le mot de passe d'un utilisateur",
     *     tags={"Utilisateurs"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Mot de passe réinitialisé"),
     *     @OA\Response(response=403, description="Action non autorisée"),
     *     @OA\Response(response=404, description="Utilisateur non trouvé")
     * )
     */
    public function resetPassword(User $user)
    {
        $status = Password::sendResetLink(['email' => $user->email]);

        if ($status === Password::RESET_LINK_SENT) {
            return response()->json([
                'message' => 'Email de réinitialisation envoyé à ' . $user->email,
            ]);
        }

        return response()->json([
            'message' => 'Impossible d\'envoyer l\'email de réinitialisation.',
        ], 500);
    }

    /**
     * @OA\Get(
     *     path="/users/statistiques",
     *     summary="Statistiques sur les utilisateurs",
     *     tags={"Utilisateurs"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(response=200, description="Statistiques"),
     *     @OA\Response(response=403, description="Action non autorisée")
     * )
     */
    public function statistiques()
    {
        return response()->json([
            'statistiques' => [
                'total_utilisateurs' => User::utilisateurs()->count(),
                'total_administrateurs' => User::administrateurs()->count(),
                'nouveaux_utilisateurs_mois' => User::where('created_at', '>=', now()->subMonth())->count(),
            ]
        ]);
    }
}
