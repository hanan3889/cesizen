<?php

namespace Database\Seeders;

use App\Models\DiagnosticConfig;
use Illuminate\Database\Seeder;

class DiagnosticConfigSeeder extends Seeder
{
    public function run(): void
    {
        $configs = [
            [
                'niveau'    => 'faible',
                'seuil_min' => 0,
                'seuil_max' => 150,
                'message'   => 'Votre niveau de stress est faible. Continuez à maintenir un bon équilibre de vie.',
            ],
            [
                'niveau'    => 'modere',
                'seuil_min' => 150,
                'seuil_max' => 300,
                'message'   => 'Votre niveau de stress est modéré. Pensez à prendre du temps pour vous et à pratiquer des activités relaxantes.',
            ],
            [
                'niveau'    => 'eleve',
                'seuil_min' => 300,
                'seuil_max' => null,
                'message'   => 'Votre niveau de stress est élevé. Il est fortement recommandé de consulter un professionnel de santé mentale.',
            ],
        ];

        foreach ($configs as $config) {
            DiagnosticConfig::updateOrCreate(
                ['niveau' => $config['niveau']],
                $config
            );
        }
    }
}
