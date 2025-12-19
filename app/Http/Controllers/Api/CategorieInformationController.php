<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CategorieInformation;
use Illuminate\Http\Request;

class CategorieInformationController extends Controller
{
    /**
     * @OA\Get(
     *     path="/categories",
     *     summary="Liste de toutes les catégories",
     *     tags={"Catégories"},
     *     @OA\Response(
     *         response=200,
     *         description="Liste des catégories",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="categories", type="array", @OA\Items(type="object"))
     *         )
     *     )
     * )
     */
    public function index()
    {
        $categories = CategorieInformation::withCount('pages')
            ->get()
            ->map(function ($categorie) {
                return [
                    'id' => $categorie->id,
                    'categorie' => $categorie->categorie,
                    'nombre_pages' => $categorie->pages_count,
                    'created_at' => $categorie->created_at,
                ];
            });

        return response()->json([
            'categories' => $categories,
        ]);
    }

    /**
     * @OA\Get(
     *     path="/categories/{id}",
     *     summary="Afficher une catégorie avec ses pages",
     *     tags={"Catégories"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID de la catégorie",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Détails de la catégorie",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="categorie", type="object")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Catégorie non trouvée"
     *     )
     * )
     */
    public function show($id)
    {
        $categorie = CategorieInformation::with(['pagesPubliees' => function ($query) {
            $query->orderBy('created_at', 'desc');
        }])->findOrFail($id);

        return response()->json([
            'categorie' => [
                'id' => $categorie->id,
                'categorie' => $categorie->categorie,
                'nombre_pages' => $categorie->nombre_pages,
                'nombre_pages_publiees' => $categorie->nombre_pages_publiees,
                'pages' => $categorie->pagesPubliees,
            ],
        ]);
    }

    /**
     * @OA\Post(
     *     path="/categories",
     *     summary="Créer une nouvelle catégorie",
     *     tags={"Catégories"},
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"categorie"},
     *             @OA\Property(property="categorie", type="string", example="Nouvelle catégorie")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Catégorie créée avec succès",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string"),
     *             @OA\Property(property="categorie", type="object")
     *         )
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="Action non autorisée"
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Validation des données échouée"
     *     )
     * )
     */
    public function store(Request $request)
    {
        if (!$request->user()->isAdmin()) {
            return response()->json([
                'message' => 'Action non autorisée',
            ], 403);
        }

        $request->validate([
            'categorie' => 'required|string|unique:categorie_informations,categorie|max:255',
        ]);

        $categorie = CategorieInformation::create([
            'categorie' => $request->categorie,
        ]);

        return response()->json([
            'message' => 'Catégorie créée avec succès',
            'categorie' => $categorie,
        ], 201);
    }

    /**
     * @OA\Put(
     *     path="/categories/{id}",
     *     summary="Mettre à jour une catégorie",
     *     tags={"Catégories"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID de la catégorie",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"categorie"},
     *             @OA\Property(property="categorie", type="string", example="Catégorie mise à jour")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Catégorie mise à jour",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string"),
     *             @OA\Property(property="categorie", type="object")
     *         )
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="Action non autorisée"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Catégorie non trouvée"
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

        $categorie = CategorieInformation::findOrFail($id);

        $request->validate([
            'categorie' => 'required|string|unique:categorie_informations,categorie,' . $id . '|max:255',
        ]);

        $categorie->update([
            'categorie' => $request->categorie,
        ]);

        return response()->json([
            'message' => 'Catégorie mise à jour',
            'categorie' => $categorie,
        ]);
    }

    /**
     * @OA\Delete(
     *     path="/categories/{id}",
     *     summary="Supprimer une catégorie",
     *     tags={"Catégories"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID de la catégorie",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Catégorie supprimée avec succès",
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
     *         description="Catégorie non trouvée"
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Impossible de supprimer la catégorie car elle contient des pages"
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

        $categorie = CategorieInformation::findOrFail($id);

        // Vérifier s'il y a des pages associées
        if ($categorie->pages()->count() > 0) {
            return response()->json([
                'message' => 'Impossible de supprimer cette catégorie car elle contient des pages',
            ], 422);
        }

        $categorie->delete();

        return response()->json([
            'message' => 'Catégorie supprimée avec succès',
        ]);
    }
}
