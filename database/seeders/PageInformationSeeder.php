<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\PageInformation;
use App\Models\CategorieInformation;

class PageInformationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // S'assure que les catégories de base existent avant de créer les pages
        $cat1 = CategorieInformation::firstOrCreate(['categorie' => 'Gestion du Stress']);
        $cat2 = CategorieInformation::firstOrCreate(['categorie' => 'Bien-être mental']);
        $cat3 = CategorieInformation::firstOrCreate(['categorie' => 'Productivité']);

        $pages = [
            [
                'titre' => 'Respirez, vous êtes au contrôle',
                'description' => 'Pratiquez la respiration carrée : inspirez pendant 4s, retenez 4s, expirez 4s, et attendez 4s. Cet exercice simple peut calmer votre système nerveux instantanément.',
                'statut' => 'publie',
                'categorie_information_id' => $cat1->id,
            ],
            [
                'titre' => 'L\'importance d\'une routine saine',
                'description' => 'Un sommeil régulier, une alimentation équilibrée et une activité physique modérée sont les piliers de la santé mentale. Essayez de fixer des heures de coucher et de lever constantes.',
                'statut' => 'publie',
                'categorie_information_id' => $cat2->id,
            ],
            [
                'titre' => 'Connectez-vous au moment présent',
                'description' => 'La pleine conscience (mindfulness) vous aide à vous détacher des pensées anxieuses. Prenez 5 minutes pour vous concentrer sur vos sensations.',
                'statut' => 'publie',
                'categorie_information_id' => $cat2->id,
            ],
            [
                'titre' => 'La technique Pomodoro pour la concentration',
                'description' => 'Pour éviter le surmenage, travaillez par intervalles de 25 minutes suivies de 5 minutes de pause. Cela préserve votre énergie mentale.',
                'statut' => 'publie',
                'categorie_information_id' => $cat3->id,
            ],
            [
                'titre' => 'Les bienfaits de l\'écriture (Journaling)',
                'description' => 'Prendre quelques minutes chaque jour pour écrire vos pensées et sentiments peut vous aider à clarifier vos idées et à réduire le stress.',
                'statut' => 'publie',
                'categorie_information_id' => $cat1->id,
            ],
        ];

        // Crée chaque page si elle n'existe pas déjà avec le même titre
        foreach ($pages as $page) {
            PageInformation::firstOrCreate(['titre' => $page['titre']], $page);
        }
    }
}