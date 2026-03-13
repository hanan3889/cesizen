<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DiagnosticConfig;
use Illuminate\Http\Request;

class DiagnosticConfigController extends Controller
{
    /**
     * Retourne la configuration des 3 niveaux de stress.
     * Accessible à tous (lecture publique pour affichage côté client).
     */
    public function index()
    {
        $configs = DiagnosticConfig::all()->keyBy('niveau');

        // Valeurs par défaut si table vide
        $defaults = [
            'faible' => ['seuil_min' => 0,   'seuil_max' => 150,  'message' => 'Votre niveau de stress est faible. Continuez à maintenir un bon équilibre de vie.'],
            'modere' => ['seuil_min' => 150,  'seuil_max' => 300,  'message' => 'Votre niveau de stress est modéré. Pensez à prendre du temps pour vous et à pratiquer des activités relaxantes.'],
            'eleve'  => ['seuil_min' => 300,  'seuil_max' => null, 'message' => 'Votre niveau de stress est élevé. Il est fortement recommandé de consulter un professionnel de santé mentale.'],
        ];

        $result = [];
        foreach (['faible', 'modere', 'eleve'] as $niveau) {
            if ($configs->has($niveau)) {
                $result[$niveau] = $configs->get($niveau);
            } else {
                $result[$niveau] = array_merge(['niveau' => $niveau], $defaults[$niveau]);
            }
        }

        return response()->json(['config' => $result]);
    }

    /**
     * Met à jour la configuration d'un niveau.
     * Réservé aux administrateurs.
     */
    public function update(Request $request, string $niveau)
    {
        if (!in_array($niveau, ['faible', 'modere', 'eleve'])) {
            return response()->json(['message' => 'Niveau invalide.'], 422);
        }

        $rules = [
            'seuil_min' => 'required|integer|min:0',
            'message'   => 'required|string|max:500',
        ];

        // seuil_max est facultatif pour "eleve"
        if ($niveau !== 'eleve') {
            $rules['seuil_max'] = 'required|integer|gt:seuil_min';
        }

        $validated = $request->validate($rules);

        if ($niveau === 'eleve') {
            $validated['seuil_max'] = null;
        }

        $config = DiagnosticConfig::updateOrCreate(
            ['niveau' => $niveau],
            $validated
        );

        DiagnosticConfig::clearCache();

        return response()->json([
            'message' => 'Configuration mise à jour.',
            'config'  => $config,
        ]);
    }

    /**
     * Supprime la configuration d'un niveau (retour aux valeurs par défaut).
     * Réservé aux administrateurs.
     */
    public function destroy(string $niveau)
    {
        if (!in_array($niveau, ['faible', 'modere', 'eleve'])) {
            return response()->json(['message' => 'Niveau invalide.'], 422);
        }

        DiagnosticConfig::where('niveau', $niveau)->delete();
        DiagnosticConfig::clearCache();

        return response()->json(['message' => 'Configuration réinitialisée aux valeurs par défaut.']);
    }
}
