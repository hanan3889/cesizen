<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->command->info(' Début du seeding de la base de données CesiZen...');
        $this->command->newLine();

        // 1. Créer les catégories d'information
        $this->command->info('Insertion des catégories d\'information...');
        $this->call(CategorieInformationSeeder::class);
        $this->command->newLine();

        // 2. Créer les pages d'information
        $this->command->info('Insertion des pages d\'information (articles)...');
        $this->call(PageInformationSeeder::class);
        $this->command->newLine();

        // 3. Créer les 43 événements de vie Holmes-Rahe
        $this->command->info('Insertion des 43 événements de vie Holmes-Rahe...');
        $this->call(EvenementVieSeeder::class);
        $this->command->newLine();

        // 4. Créer l'administrateur et les utilisateurs de test
        $this->command->info('Création de l\'administrateur et des utilisateurs...');
        $this->call(AdminUserSeeder::class);
        $this->command->newLine();

        // 5. Insérer la configuration du diagnostic de stress
        $this->command->info('Insertion de la configuration du diagnostic de stress...');
        $this->call(DiagnosticConfigSeeder::class);
        $this->command->newLine();

        $this->command->info('Seeding terminé avec succès !');
        $this->command->newLine();

        $this->command->info('Récapitulatif :');
        $this->command->table(
            ['Élément', 'Quantité'],
            [
                ['Catégories d\'information', '5'],
                ['Pages d\'information', '5'],
                ['Événements de vie', '43'],
                ['Utilisateurs', '3 (1 admin + 2 utilisateurs)'],
                ['Configurations diagnostic', '3 (faible, modéré, élevé)'],
            ]
        );

        $this->command->newLine();
    }
}