<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\EvenementVie;
use Illuminate\Http\Request;

class EvenementVieController extends Controller
{
    /**
     * @OA\Get(
     *     path="/evenements",
     *     summary="Liste de tous les événements de vie",
     *     tags={"Événements"},
     *     @OA\Parameter(
     *         name="impact",
     *         in="query",
     *         description="Filtrer par niveau d'impact (eleve, moyen, faible)",
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Parameter(
     *         name="ordre",
     *         in="query",
     *         description="Trier par points (asc, desc)",
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Liste des événements de vie",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="evenements", type="array", @OA\Items(type="object")),
     *             @OA\Property(property="total", type="integer")
     *         )
     *     )
     * )
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
     * @OA\Get(
     *     path="/evenements/{id}",
     *     summary="Afficher un événement spécifique",
     *     tags={"Événements"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID de l'événement",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Détails de l'événement",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="evenement", type="object")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Événement non trouvé"
     *     )
     * )
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
     * @OA\Get(
     *     path="/evenements/search",
     *     summary="Rechercher des événements par mot-clé",
     *     tags={"Événements"},
     *     @OA\Parameter(
     *         name="q",
     *         in="query",
     *         required=true,
     *         description="Mot-clé de recherche",
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Résultats de la recherche",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="evenements", type="array", @OA\Items(type="object")),
     *             @OA\Property(property="total", type="integer")
     *         )
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Validation des données échouée"
     *     )
     * )
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
