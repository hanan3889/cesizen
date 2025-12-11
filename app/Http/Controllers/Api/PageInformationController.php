<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PageInformation;
use Illuminate\Http\Request;

class PageInformationController extends Controller
{
    /**
     * Liste des pages 
     */
    public function index(Request $request)
    {
        $query = PageInformation::with(['categorie', 'administrateur']);

        // Filtrer par catégorie si demandé
        if ($request->has('categorie_id')) {
            $query->where('categorie_information_id', $request->categorie_id);
        }

        // Filtrer par statut 
        if ($request->user() && $request->user()->isAdmin() && $request->has('statut')) {
            $query->where('statut', $request->statut);
        } else {
            // Pour les utilisateurs normaux, seulement les pages publiées
            $query->publiees();
        }

        $pages = $query->orderBy('created_at', 'desc')->paginate(10);

        return response()->json($pages);
    }

    /**
     * Afficher une page spécifique
     */
    public function show($id)
    {
        $page = PageInformation::with(['categorie', 'administrateur'])->findOrFail($id);

        // Vérifier si la page est publiée
        if ($page->statut !== 'publie' && (!auth()->check() || !auth()->user()->isAdmin())) {
            return response()->json([
                'message' => 'Cette page n\'est pas accessible',
            ], 403);
        }

        return response()->json([
            'page' => $page,
        ]);
    }

    /**
     * Créer une nouvelle page
     */
    public function store(Request $request)
    {
        if (!$request->user()->isAdmin()) {
            return response()->json([
                'message' => 'Action non autorisée',
            ], 403);
        }

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
     * Mettre à jour une page
     */
    public function update(Request $request, $id)
    {
        if (!$request->user()->isAdmin()) {
            return response()->json([
                'message' => 'Action non autorisée',
            ], 403);
        }

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
     * Supprimer une page
     */
    public function destroy(Request $request, $id)
    {
        if (!$request->user()->isAdmin()) {
            return response()->json([
                'message' => 'Action non autorisée',
            ], 403);
        }

        $page = PageInformation::findOrFail($id);
        $page->delete();

        return response()->json([
            'message' => 'Page supprimée avec succès',
        ]);
    }

    /**
     * Publier une page
     */
    public function publier(Request $request, $id)
    {
        if (!$request->user()->isAdmin()) {
            return response()->json([
                'message' => 'Action non autorisée',
            ], 403);
        }

        $page = PageInformation::findOrFail($id);
        $page->publier();

        return response()->json([
            'message' => 'Page publiée',
            'page' => $page,
        ]);
    }

    /**
     * Archiver une page
     */
    public function archiver(Request $request, $id)
    {
        if (!$request->user()->isAdmin()) {
            return response()->json([
                'message' => 'Action non autorisée',
            ], 403);
        }

        $page = PageInformation::findOrFail($id);
        $page->archiver();

        return response()->json([
            'message' => 'Page archivée',
            'page' => $page,
        ]);
    }
}
