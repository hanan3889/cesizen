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
    public function show($categoryId)
    {
        // We just pass the ID to the frontend.
        // The frontend component will fetch the data from the API.
        return Inertia::render('Categories/Show', [
            'categoryId' => $categoryId,
        ]);
    }
}
