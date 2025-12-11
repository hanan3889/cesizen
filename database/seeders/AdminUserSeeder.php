<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Vérifier si un admin existe déjà
        if (User::where('role', 'administrateur')->exists()) {
            $this->command->warn('Un administrateur existe déjà !');
            return;
        }

        // Créer l'administrateur par défaut
        $admin = User::create([
            'name' => 'Administrateur CesiZen',
            'email' => 'admin@cesizen.fr',
            'password' => Hash::make('Admin@2025'),
            'role' => 'administrateur',
            'email_verified_at' => now(),
        ]);

        $this->command->info('Administrateur créé avec succès !');
        $this->command->info('Email: admin@cesizen.fr');
        $this->command->info('Mot de passe: Admin@2025');

        // Créer quelques utilisateurs de test 
        $utilisateurs = [
            [
                'name' => 'Jean Dupont',
                'email' => 'jean.dupont@example.com',
                'password' => Hash::make('password123'),
                'role' => 'utilisateur',
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Marie Martin',
                'email' => 'marie.martin@example.com',
                'password' => Hash::make('password123'),
                'role' => 'utilisateur',
                'email_verified_at' => now(),
            ],
        ];

        foreach ($utilisateurs as $utilisateur) {
            User::create($utilisateur);
        }

        $this->command->info('2 utilisateurs de test créés avec succès !');
    }
}
