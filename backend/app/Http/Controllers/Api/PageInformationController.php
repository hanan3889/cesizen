<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PageInformation;
use Illuminate\Http\Request;

class PageInformationController extends Controller
{
    /**
     * @OA\Get(
     *     path="/pages",
     *     summary="Liste des pages",
     *     tags={"Pages"},
     *     @OA\Parameter(
     *         name="categorie_id",
     *         in="query",
     *         description="Filtrer par catégorie",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Parameter(
     *         name="statut",
     *         in="query",
     *         description="Filtrer by statut (brouillon, publie, archive) - Admin only",
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Liste des pages",
     *         @OA\JsonContent(type="array", @OA\Items(type="object"))
     *     )
     * )
     */
    public function index(Request $request)
    {
        $query = PageInformation::with(['categorie', 'administrateur']);

        // Filtrer par catégorie si demandé
        if ($request->has('categorie_id')) {
            $query->where('categorie_information_id', $request->categorie_id);
        }

        // Utiliser auth('sanctum') pour détecter l'admin même sur les routes publiques
        $authUser = auth('sanctum')->user();

        // Filtrer par statut
        if ($authUser && $authUser->isAdmin()) {
            // Admin voit tout (brouillon, publie, archive), avec filtre optionnel
            if ($request->has('statut')) {
                $query->where('statut', $request->statut);
            }
        } else {
            // Utilisateurs normaux : seulement les pages publiées
            $query->publiees();
        }

        $pages = $query->orderBy('created_at', 'desc')->paginate(10);

        return response()->json($pages);
    }

    /**
     * @OA\Get(
     *     path="/pages/{id}",
     *     summary="Afficher une page spécifique",
     *     tags={"Pages"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID de la page",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Détails de la page",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="page", type="object")
     *         )
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="Page non accessible"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Page non trouvée"
     *     )
     * )
     */
    public function show($id)
    {
        $page = PageInformation::with(['categorie', 'administrateur'])->findOrFail($id);

        $authUser = auth('sanctum')->user();

        // Vérifier si la page est publiée
        if ($page->statut !== 'publie' && (!$authUser || !$authUser->isAdmin())) {
            return response()->json([
                'message' => 'Cette page n\'est pas accessible',
            ], 403);
        }

        return response()->json([
            'page' => $page,
        ]);
    }

    /**
     * @OA\Post(
     *     path="/pages",
     *     summary="Créer une nouvelle page",
     *     tags={"Pages"},
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"titre", "description", "categorie_information_id"},
     *             @OA\Property(property="titre", type="string", example="Nouveau titre"),
     *             @OA\Property(property="description", type="string", example="Description de la page"),
     *             @OA\Property(property="categorie_information_id", type="integer", example=1),
     *             @OA\Property(property="statut", type="string", example="brouillon", enum={"brouillon", "publie", "archive"})
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Page créée avec succès",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string"),
     *             @OA\Property(property="page", type="object")
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
        $request->validate([
            'titre' => 'required|string|max:255',
            'description' => 'required|string',
            'categorie_information_id' => 'required|exists:categorie_informations,id',
            'statut' => 'sometimes|in:brouillon,publie,archive',
        ]);

        $page = PageInformation::create([
            'titre' => $request->titre,
            'description' => $request->description,
            'categorie_information_id' => $request->categorie_information_id,
            'administrateur_id' => $request->user()->id,
            'statut' => $request->statut ?? 'brouillon',
        ]);

        return response()->json([
            'message' => 'Page créée avec succès',
            'page' => $page->load(['categorie', 'administrateur']),
        ], 201);
    }

    /**
     * @OA\Put(
     *     path="/pages/{id}",
     *     summary="Mettre à jour une page",
     *     tags={"Pages"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID de la page",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         @OA\JsonContent(
     *             @OA\Property(property="titre", type="string", example="Titre mis à jour"),
     *             @OA\Property(property="description", type="string", example="Description mise à jour"),
     *             @OA\Property(property="categorie_information_id", type="integer", example=1),
     *             @OA\Property(property="statut", type="string", example="publie", enum={"brouillon", "publie", "archive"})
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Page mise à jour",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string"),
     *             @OA\Property(property="page", type="object")
     *         )
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="Action non autorisée"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Page non trouvée"
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Validation des données échouée"
     *     )
     * )
     */
    public function update(Request $request, $id)
    {
        $page = PageInformation::findOrFail($id);

        $request->validate([
            'titre' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'categorie_information_id' => 'sometimes|exists:categorie_informations,id',
            'statut' => 'sometimes|in:brouillon,publie,archive',
        ]);

        $page->update($request->only(['titre', 'description', 'categorie_information_id', 'statut']));

        return response()->json([
            'message' => 'Page mise à jour',
            'page' => $page->load(['categorie', 'administrateur']),
        ]);
    }

    /**
     * @OA\Delete(
     *     path="/pages/{id}",
     *     summary="Supprimer une page",
     *     tags={"Pages"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID de la page",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Page supprimée avec succès",
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
     *         description="Page non trouvée"
     *     )
     * )
     */
    public function destroy(Request $request, $id)
    {
        $page = PageInformation::findOrFail($id);
        $page->delete();

        return response()->json([
            'message' => 'Page supprimée avec succès',
        ]);
    }

    /**
     * @OA\Post(
     *     path="/pages/{id}/publier",
     *     summary="Publier une page",
     *     tags={"Pages"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID de la page",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Page publiée",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string"),
     *             @OA\Property(property="page", type="object")
     *         )
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="Action non autorisée"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Page non trouvée"
     *     )
     * )
     */
    public function publier(Request $request, $id)
    {
        $page = PageInformation::findOrFail($id);
        $page->publier();

        return response()->json([
            'message' => 'Page publiée',
            'page' => $page,
        ]);
    }

    /**
     * @OA\Post(
     *     path="/pages/{id}/archiver",
     *     summary="Archiver une page",
     *     tags={"Pages"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID de la page",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Page archivée",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string"),
     *             @OA\Property(property="page", type="object")
     *         )
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="Action non autorisée"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Page non trouvée"
     *     )
     * )
     */
    public function archiver(Request $request, $id)
    {
        $page = PageInformation::findOrFail($id);
        $page->archiver();

        return response()->json([
            'message' => 'Page archivée',
            'page' => $page,
        ]);
    }

    /**
     *
     * @OA\Get(
     *     path="/pages/latest",
     *     summary="Récupérer les 5 dernières pages publiées",
     *     tags={"Pages"},
     *     @OA\Response(
     *         response=200,
     *         description="Les 5 dernières pages",
     *         @OA\JsonContent(type="array", @OA\Items(type="object"))
     *     )
     * )
     */
    public function latest()
    {
        $pages = PageInformation::with('categorie')
            ->publiees()
            ->latest('updated_at')
            ->take(5)
            ->get();

        return response()->json($pages);
    }

    /**
     *
     * @OA\Get(
     *     path="/pages/slug/{slug}",
     *     summary="Afficher une page par son slug",
     *     tags={"Pages"},
     *     @OA\Parameter(
     *         name="slug",
     *         in="path",
     *         required=true,
     *         description="Slug de la page",
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Détails de la page",
     *         @OA\JsonContent(type="object")
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="Page non accessible"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Page non trouvée"
     *     )
     * )
     */
    public function showBySlug(string $slug)
    {
        $page = PageInformation::with(['categorie', 'administrateur'])
            ->where('slug', $slug)
            ->firstOrFail();

        $authUser = auth('sanctum')->user();

        // Vérifier si la page est publiée
        if ($page->statut !== 'publie' && (!$authUser || !$authUser->isAdmin())) {
            return response()->json([
                'message' => 'Cette page n\'est pas accessible',
            ], 403);
        }

        return response()->json($page);
    }
}
