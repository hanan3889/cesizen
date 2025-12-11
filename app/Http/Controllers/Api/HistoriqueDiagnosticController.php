<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\HistoriqueDiagnostic;
use App\Models\DiagnosticStress;
use Illuminate\Http\Request;

class HistoriqueDiagnosticController extends Controller
{
    /**
     * Historique complet de l'utilisateur connecté
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
     * Historique récent (7 derniers jours)
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
     * Enregistrer une consultation de diagnostic
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
     * Supprimer l'historique complet (RGPD)
     */
    public function destroy(Request $request)
    {
        HistoriqueDiagnostic::where('utilisateur_id', $request->user()->id)->delete();

        return response()->json([
            'message' => 'Historique supprimé avec succès',
        ]);
    }
}
