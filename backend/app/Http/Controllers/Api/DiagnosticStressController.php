<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DiagnosticStress;
use App\Models\EvenementVie;
use Illuminate\Http\Request;

class DiagnosticStressController extends Controller
{
    /**
     * @OA\Get(
     *     path="/diagnostics",
     *     summary="Liste des diagnostics de l'utilisateur connecté",
     *     tags={"Diagnostics"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Liste des diagnostics",
     *         @OA\JsonContent(type="array", @OA\Items(type="object"))
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Non authentifié"
     *     )
     * )
     */
    public function index(Request $request)
    {
        $diagnostics = DiagnosticStress::where('utilisateur_id', $request->user()->id)
            ->with(['evenements', 'administrateur'])
            ->orderBy('date', 'desc')
            ->paginate(10);

        return response()->json($diagnostics);
    }

    /**
     * @OA\Post(
     *     path="/diagnostics",
     *     summary="Créer un nouveau diagnostic",
     *     tags={"Diagnostics"},
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"evenements"},
     *             @OA\Property(property="evenements", type="array", @OA\Items(type="integer"), example={1, 2, 3})
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Diagnostic créé avec succès",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string"),
     *             @OA\Property(property="diagnostic", type="object")
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Non authentifié"
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
            'evenements' => 'required|array|min:1',
            'evenements.*' => 'exists:evenement_vies,id',
        ]);

        // Créer le diagnostic avec les événements sélectionnés
        $diagnostic = DiagnosticStress::creerPourUtilisateur(
            $request->user()->id,
            $request->evenements
        );

        // Charger les relations
        $diagnostic->load('evenements');

        return response()->json([
            'message' => 'Diagnostic créé avec succès',
            'diagnostic' => [
                'id' => $diagnostic->id,
                'date' => $diagnostic->date,
                'score' => $diagnostic->score,
                'niveau_stress' => $diagnostic->niveau_stress,
                'recommandation' => $diagnostic->recommandation,
                'nombre_evenements' => $diagnostic->nombre_evenements,
                'evenements' => $diagnostic->evenements,
            ],
        ], 201);
    }

    /**
     * @OA\Get(
     *     path="/diagnostics/{id}",
     *     summary="Afficher un diagnostic spécifique",
     *     tags={"Diagnostics"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID du diagnostic",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Détails du diagnostic",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="diagnostic", type="object")
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Non authentifié"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Diagnostic non trouvé"
     *     )
     * )
     */
    public function show(Request $request, $id)
    {
        $diagnostic = DiagnosticStress::where('utilisateur_id', $request->user()->id)
            ->with(['evenements', 'administrateur'])
            ->findOrFail($id);

        return response()->json([
            'diagnostic' => [
                'id' => $diagnostic->id,
                'date' => $diagnostic->date,
                'score' => $diagnostic->score,
                'niveau_stress' => $diagnostic->niveau_stress,
                'recommandation' => $diagnostic->recommandation,
                'nombre_evenements' => $diagnostic->nombre_evenements,
                'evenements' => $diagnostic->evenements,
                'details_resultats' => $diagnostic->details_resultats,
            ],
        ]);
    }

    /**
     * @OA\Put(
     *     path="/diagnostics/{id}",
     *     summary="Mettre à jour les événements d'un diagnostic",
     *     tags={"Diagnostics"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID du diagnostic",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"evenements"},
     *             @OA\Property(property="evenements", type="array", @OA\Items(type="integer"), example={1, 2, 3})
     *         )
     *     ),
     *     @OA\Response(response=200, description="Diagnostic mis à jour"),
     *     @OA\Response(response=401, description="Non authentifié"),
     *     @OA\Response(response=404, description="Diagnostic non trouvé")
     * )
     */
    public function update(Request $request, $id)
    {
        $diagnostic = DiagnosticStress::where('utilisateur_id', $request->user()->id)
            ->findOrFail($id);

        $request->validate([
            'evenements'   => 'required|array|min:1',
            'evenements.*' => 'exists:evenement_vies,id',
        ]);

        $syncData = [];
        foreach ($request->evenements as $evenementId) {
            $syncData[$evenementId] = ['date_selection' => now()];
        }
        $diagnostic->evenements()->sync($syncData);
        $diagnostic->calculerScore();
        $diagnostic->load('evenements');

        return response()->json([
            'message'    => 'Diagnostic mis à jour',
            'diagnostic' => [
                'id'                => $diagnostic->id,
                'date'              => $diagnostic->date,
                'score'             => $diagnostic->score,
                'niveau_stress'     => $diagnostic->niveau_stress,
                'recommandation'    => $diagnostic->recommandation,
                'nombre_evenements' => $diagnostic->nombre_evenements,
                'evenements'        => $diagnostic->evenements,
            ],
        ]);
    }

    /**
     * @OA\Delete(
     *     path="/diagnostics/{id}",
     *     summary="Supprimer un diagnostic",
     *     tags={"Diagnostics"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID du diagnostic",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Diagnostic supprimé avec succès",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string")
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Non authentifié"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Diagnostic non trouvé"
     *     )
     * )
     */
    public function destroy(Request $request, $id)
    {
        $diagnostic = DiagnosticStress::where('utilisateur_id', $request->user()->id)
            ->findOrFail($id);

        $diagnostic->delete();

        return response()->json([
            'message' => 'Diagnostic supprimé avec succès',
        ]);
    }

    /**
     * @OA\Get(
     *     path="/diagnostics/statistiques",
     *     summary="Statistiques des diagnostics de l'utilisateur",
     *     tags={"Diagnostics"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Statistiques des diagnostics",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="statistiques", type="object")
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Non authentifié"
     *     )
     * )
     */
    public function statistiques(Request $request)
    {
        $stats = DiagnosticStress::statistiquesUtilisateur($request->user()->id);

        return response()->json([
            'statistiques' => $stats,
        ]);
    }

    /**
     * @OA\Get(
     *     path="/diagnostics/recents",
     *     summary="Diagnostics récents (30 derniers jours)",
     *     tags={"Diagnostics"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Liste des diagnostics récents",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="diagnostics", type="array", @OA\Items(type="object"))
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Non authentifié"
     *     )
     * )
     */
    public function recents(Request $request)
    {
        $diagnostics = DiagnosticStress::where('utilisateur_id', $request->user()->id)
            ->recents()
            ->with('evenements')
            ->orderBy('date', 'desc')
            ->get();

        return response()->json([
            'diagnostics' => $diagnostics,
        ]);
    }

    /* ─────────────────────────────────────────────
       Routes Admin — tous les diagnostics
    ───────────────────────────────────────────── */

    public function adminIndex(Request $request)
    {
        $diagnostics = DiagnosticStress::with(['utilisateur', 'evenements'])
            ->orderBy('date', 'desc')
            ->paginate(15);

        return response()->json($diagnostics);
    }

    public function adminUpdate(Request $request, $id)
    {
        $diagnostic = DiagnosticStress::findOrFail($id);

        $request->validate([
            'date'         => 'sometimes|date',
            'evenements'   => 'sometimes|array|min:1',
            'evenements.*' => 'exists:evenement_vies,id',
        ]);

        if ($request->has('date')) {
            $diagnostic->date = $request->date;
            $diagnostic->save();
        }

        if ($request->has('evenements')) {
            $syncData = [];
            foreach ($request->evenements as $evenementId) {
                $syncData[$evenementId] = ['date_selection' => now()];
            }
            $diagnostic->evenements()->sync($syncData);
            $diagnostic->calculerScore();
        }

        $diagnostic->load('evenements', 'utilisateur');

        return response()->json([
            'message'    => 'Diagnostic mis à jour',
            'diagnostic' => $diagnostic,
        ]);
    }

    public function adminDestroy($id)
    {
        $diagnostic = DiagnosticStress::findOrFail($id);
        $diagnostic->delete();

        return response()->json(['message' => 'Diagnostic supprimé avec succès']);
    }
}
