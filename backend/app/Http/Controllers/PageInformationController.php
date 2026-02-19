<?php

namespace App\Http\Controllers;

use App\Models\PageInformation;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PageInformationController extends Controller
{
    /**
     * Affiche la liste de toutes les pages d'information publiées.
     */
    public function index()
    {
        $articles = PageInformation::publiees()
                        ->with('categorie') // Charger la catégorie associée
                        ->latest() // Trier par date de publication décroissante
                        ->get();

        return Inertia::render('Informations', [
            'articles' => $articles,
        ]);
    }
}
