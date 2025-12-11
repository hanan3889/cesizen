<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\EvenementVie;

class EvenementVieSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $evenements = [
            ['type_evenement' => 'Décès du conjoint', 'points' => 100],
            ['type_evenement' => 'Divorce', 'points' => 73],
            ['type_evenement' => 'Séparation conjugale', 'points' => 65],
            ['type_evenement' => 'Peine de prison', 'points' => 63],
            ['type_evenement' => 'Décès d\'un proche parent', 'points' => 63],
            ['type_evenement' => 'Maladie ou blessure personnelle', 'points' => 53],
            ['type_evenement' => 'Mariage', 'points' => 50],
            ['type_evenement' => 'Licenciement', 'points' => 47],
            ['type_evenement' => 'Réconciliation conjugale', 'points' => 45],
            ['type_evenement' => 'Retraite', 'points' => 45],
            ['type_evenement' => 'Changement dans la santé d\'un membre de la famille', 'points' => 44],
            ['type_evenement' => 'Grossesse', 'points' => 40],
            ['type_evenement' => 'Difficultés sexuelles', 'points' => 39],
            ['type_evenement' => 'Arrivée d\'un nouveau membre dans la famille', 'points' => 39],
            ['type_evenement' => 'Réadaptation professionnelle', 'points' => 39],
            ['type_evenement' => 'Changement de situation financière', 'points' => 38],
            ['type_evenement' => 'Décès d\'un ami proche', 'points' => 37],
            ['type_evenement' => 'Changement de secteur d\'activité', 'points' => 36],
            ['type_evenement' => 'Changement dans le nombre de disputes conjugales', 'points' => 35],
            ['type_evenement' => 'Hypothèque ou prêt important', 'points' => 31],
            ['type_evenement' => 'Saisie d\'hypothèque ou de prêt', 'points' => 30],
            ['type_evenement' => 'Changement de responsabilités au travail', 'points' => 29],
            ['type_evenement' => 'Départ d\'un enfant de la maison', 'points' => 29],
            ['type_evenement' => 'Difficultés avec la belle-famille', 'points' => 29],
            ['type_evenement' => 'Réussite personnelle remarquable', 'points' => 28],
            ['type_evenement' => 'Conjoint commence ou arrête de travailler', 'points' => 26],
            ['type_evenement' => 'Début ou fin de scolarité', 'points' => 26],
            ['type_evenement' => 'Changement de conditions de vie', 'points' => 25],
            ['type_evenement' => 'Révision des habitudes personnelles', 'points' => 24],
            ['type_evenement' => 'Difficultés avec le patron', 'points' => 23],
            ['type_evenement' => 'Changement d\'horaires ou de conditions de travail', 'points' => 20],
            ['type_evenement' => 'Changement de résidence', 'points' => 20],
            ['type_evenement' => 'Changement d\'école', 'points' => 20],
            ['type_evenement' => 'Changement de loisirs', 'points' => 19],
            ['type_evenement' => 'Changement d\'activités religieuses', 'points' => 19],
            ['type_evenement' => 'Changement d\'activités sociales', 'points' => 18],
            ['type_evenement' => 'Hypothèque ou prêt mineur', 'points' => 17],
            ['type_evenement' => 'Changement d\'habitudes de sommeil', 'points' => 16],
            ['type_evenement' => 'Changement du nombre de réunions familiales', 'points' => 15],
            ['type_evenement' => 'Changement d\'habitudes alimentaires', 'points' => 15],
            ['type_evenement' => 'Vacances', 'points' => 13],
            ['type_evenement' => 'Période de fêtes (Noël)', 'points' => 12],
            ['type_evenement' => 'Infraction mineure à la loi', 'points' => 11],
        ];

        foreach ($evenements as $evenement) {
            EvenementVie::create($evenement);
        }

        $this->command->info('43 événements de vie Holmes-Rahe insérés avec succès !');
    }
}
