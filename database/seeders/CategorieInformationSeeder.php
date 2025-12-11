<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\CategorieInformation;

class CategorieInformationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            'Stress et anxiété',
            'Santé mentale générale',
            'Bien-être et relaxation',
            'Prévention et hygiène de vie',
            'Ressources et aide professionnelle',
        ];

        foreach ($categories as $categorie) {
            CategorieInformation::create([
                'categorie' => $categorie
            ]);
        }

        $this->command->info('5 catégories d\'information insérées avec succès !');
    }
}
