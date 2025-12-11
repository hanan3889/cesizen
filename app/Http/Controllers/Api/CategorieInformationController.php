<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CategorieInformation;
use Illuminate\Http\Request;

class CategorieInformationController extends Controller
{
    /**
     * Liste de toutes les catégories
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
     * Afficher une catégorie avec ses pages
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
     * Créer une nouvelle catégorie
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
     * Mettre à jour une catégorie
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
     * Supprimer une catégorie
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
