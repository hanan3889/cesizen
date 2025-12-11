<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\EvenementVie;
use Illuminate\Http\Request;

class EvenementVieController extends Controller
{
    /**
     * Liste de tous les événements de vie
     */
    public function index(Request $request)
    {
        $query = EvenementVie::query();

        // Filtrer par niveau d'impact si demandé
        if ($request->has('impact')) {
            switch ($request->impact) {
                case 'eleve':
                    $query->impactElevé();
                    break;
                case 'moyen':
                    $query->impactMoyen();
                    break;
                case 'faible':
                    $query->impactFaible();
                    break;
            }
        }

        // Trier par points
        $ordre = $request->get('ordre', 'desc');
        if ($ordre === 'asc') {
            $query->parPointsAsc();
        } else {
            $query->parPointsDesc();
        }

        $evenements = $query->get()->map(function ($evenement) {
            return [
                'id' => $evenement->id,
                'type_evenement' => $evenement->type_evenement,
                'points' => $evenement->points,
                'niveau_impact' => $evenement->niveau_impact,
            ];
        });

        return response()->json([
            'evenements' => $evenements,
            'total' => $evenements->count(),
        ]);
    }

    /**
     * Afficher un événement spécifique
     */
    public function show($id)
    {
        $evenement = EvenementVie::findOrFail($id);

        return response()->json([
            'evenement' => [
                'id' => $evenement->id,
                'type_evenement' => $evenement->type_evenement,
                'points' => $evenement->points,
                'niveau_impact' => $evenement->niveau_impact,
            ],
        ]);
    }

    /**
     * Rechercher des événements par mot-clé
     */
    public function search(Request $request)
    {
        $request->validate([
            'q' => 'required|string|min:2',
        ]);

        $evenements = EvenementVie::where('type_evenement', 'like', '%' . $request->q . '%')
            ->parPointsDesc()
            ->get()
            ->map(function ($evenement) {
                return [
                    'id' => $evenement->id,
                    'type_evenement' => $evenement->type_evenement,
                    'points' => $evenement->points,
                    'niveau_impact' => $evenement->niveau_impact,
                ];
            });

        return response()->json([
            'evenements' => $evenements,
            'total' => $evenements->count(),
        ]);
    }
}
