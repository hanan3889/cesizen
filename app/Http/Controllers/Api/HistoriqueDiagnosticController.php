<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\HistoriqueDiagnostic;
use App\Models\DiagnosticStress;
use Illuminate\Http\Request;

class HistoriqueDiagnosticController extends Controller
{
    /**
     * @OA\Get(
     *     path="/historiques",
     *     summary="Historique complet de l'utilisateur connecté",
     *     tags={"Historiques"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Historique des diagnostics",
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
        $historique = HistoriqueDiagnostic::where('utilisateur_id', $request->user()->id)
            ->with(['diagnostic.evenements'])
            ->dernierEnPremier()
            ->paginate(20);

        return response()->json($historique);
    }

    /**
     * @OA\Get(
     *     path="/historiques/recent",
     *     summary="Historique récent (7 derniers jours)",
     *     tags={"Historiques"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Historique récent des diagnostics",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="historique", type="array", @OA\Items(type="object"))
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Non authentifié"
     *     )
     * )
     */
    public function recent(Request $request)
    {
        $historique = HistoriqueDiagnostic::where('utilisateur_id', $request->user()->id)
            ->recent()
            ->with(['diagnostic.evenements'])
            ->dernierEnPremier()
            ->get();

        return response()->json([
            'historique' => $historique,
        ]);
    }

    /**
     * @OA\Post(
     *     path="/historiques",
     *     summary="Enregistrer une consultation de diagnostic",
     *     tags={"Historiques"},
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"diagnostic_stress_id"},
     *             @OA\Property(property="diagnostic_stress_id", type="integer", example=1)
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Consultation enregistrée",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string"),
     *             @OA\Property(property="historique", type="object")
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
            'diagnostic_stress_id' => 'required|exists:diagnostic_stresses,id',
        ]);

        // Vérifier que le diagnostic appartient à l'utilisateur
        $diagnostic = DiagnosticStress::where('id', $request->diagnostic_stress_id)
            ->where('utilisateur_id', $request->user()->id)
            ->firstOrFail();

        $historique = HistoriqueDiagnostic::enregistrerConsultation(
            $request->user()->id,
            $request->diagnostic_stress_id
        );

        return response()->json([
            'message' => 'Consultation enregistrée',
            'historique' => $historique->load(['diagnostic']),
        ], 201);
    }

    /**
     * @OA\Delete(
     *     path="/historiques",
     *     summary="Supprimer l'historique complet (RGPD)",
     *     tags={"Historiques"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Historique supprimé avec succès",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string")
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Non authentifié"
     *     )
     * )
     */
    public function destroy(Request $request)
    {
        HistoriqueDiagnostic::where('utilisateur_id', $request->user()->id)->delete();

        return response()->json([
            'message' => 'Historique supprimé avec succès',
        ]);
    }
}
