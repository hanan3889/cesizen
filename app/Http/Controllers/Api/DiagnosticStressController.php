<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DiagnosticStress;
use App\Models\EvenementVie;
use Illuminate\Http\Request;

class DiagnosticStressController extends Controller
{
    /**
     * Liste des diagnostics de l'utilisateur connecté
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
     * Créer un nouveau diagnostic
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
     * Afficher un diagnostic spécifique
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
     * Supprimer un diagnostic
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
     * Statistiques des diagnostics de l'utilisateur
     */
    public function statistiques(Request $request)
    {
        $stats = DiagnosticStress::statistiquesUtilisateur($request->user()->id);

        return response()->json([
            'statistiques' => $stats,
        ]);
    }

    /**
     * Diagnostics récents (30 derniers jours)
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
}
