<?php

namespace App\Http\Controllers;

use App\Models\CategorieInformation;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategorieInformationController extends Controller
{
    /**
     * Affiche une catégorie spécifique et ses pages publiées.
     */
    public function show(string $categoryName)
    {
        // Récupère la catégorie avec ses pages publiées, ou échoue avec une erreur 404
        $category = CategorieInformation::with('pagesPubliees')
                        ->where('categorie', $categoryName)
                        ->firstOrFail();

        return Inertia::render('Categories/Show', [
            'category' => $category,
        ]);
    }
}
