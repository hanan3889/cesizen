<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\PageInformation;
use App\Models\CategorieInformation;
use Illuminate\Support\Str;

class PageInformationSeeder extends Seeder
{
    public function run(): void
    {
        $stress     = CategorieInformation::firstOrCreate(['categorie' => 'Stress et anxiété']);
        $sante      = CategorieInformation::firstOrCreate(['categorie' => 'Santé mentale générale']);
        $bienetre   = CategorieInformation::firstOrCreate(['categorie' => 'Bien-être et relaxation']);
        $prevention = CategorieInformation::firstOrCreate(['categorie' => 'Prévention et hygiène de vie']);
        $ressources = CategorieInformation::firstOrCreate(['categorie' => 'Ressources et aide professionnelle']);

        $pages = [

            // ─── Stress et anxiété ────────────────────────────────────────────
            [
                'titre'                    => 'Comprendre le stress : origines et mécanismes',
                'description'              => "Le stress est une réponse naturelle de l'organisme face à une situation perçue comme menaçante ou exigeante. Lorsque le cerveau détecte un danger, il déclenche la libération d'hormones comme l'adrénaline et le cortisol, préparant le corps à « se battre ou fuir ». Si ce mécanisme est utile à court terme, une exposition prolongée au stress chronique peut avoir des effets délétères sur la santé physique et mentale : troubles du sommeil, irritabilité, problèmes cardiovasculaires ou affaiblissement du système immunitaire. Reconnaître les signaux du stress (tensions musculaires, pensées envahissantes, fatigue persistante) est la première étape pour mieux le gérer.",
                'statut'                   => 'publie',
                'categorie_information_id' => $stress->id,
            ],
            [
                'titre'                    => 'La respiration carrée : votre bouton pause instantané',
                'description'              => "La respiration carrée (box breathing) est une technique validée par de nombreuses études pour réduire rapidement le niveau de stress. Son principe est simple : inspirez pendant 4 secondes, retenez votre souffle 4 secondes, expirez lentement pendant 4 secondes, puis attendez 4 secondes avant de recommencer. Pratiquez 4 à 6 cycles consécutifs dès que vous ressentez une montée d'anxiété. Cette méthode stimule le nerf vague et active le système nerveux parasympathique, responsable du calme et de la récupération. Aucun matériel n'est nécessaire : vous pouvez la pratiquer discrètement au bureau, dans les transports ou avant une réunion importante.",
                'statut'                   => 'publie',
                'categorie_information_id' => $stress->id,
            ],
            [
                'titre'                    => 'Anxiété sociale : stratégies pour reprendre confiance',
                'description'              => "L'anxiété sociale se manifeste par une peur intense du jugement d'autrui dans les situations de groupe ou de prise de parole. Elle peut conduire à l'évitement, renforçant ainsi le cycle de la peur. Des approches telles que la thérapie cognitivo-comportementale (TCC), l'exposition progressive et la pleine conscience ont prouvé leur efficacité. En pratique, commencez par de petits défis sociaux quotidiens, tenez un journal de vos réussites, et remettez en question les pensées automatiques négatives. Si l'anxiété interfère significativement avec votre vie quotidienne, un accompagnement professionnel reste la solution la plus adaptée.",
                'statut'                   => 'brouillon',
                'categorie_information_id' => $stress->id,
            ],
            [
                'titre'                    => 'Le stress au travail : anciennes approches (2020)',
                'description'              => "Article de référence sur les méthodes de gestion du stress professionnel utilisées avant la généralisation du télétravail. Bien que certaines recommandations restent pertinentes, les pratiques ont considérablement évolué depuis. Cet article est conservé à titre d'archive historique.",
                'statut'                   => 'archive',
                'categorie_information_id' => $stress->id,
            ],

            // ─── Santé mentale générale ───────────────────────────────────────
            [
                'titre'                    => 'Santé mentale : briser les tabous et en parler',
                'description'              => "Parler de sa santé mentale reste encore difficile dans beaucoup de contextes culturels et professionnels, malgré une prise de conscience croissante. Pourtant, une personne sur cinq est confrontée à un trouble mental au cours de sa vie. Dépression, burn-out, troubles anxieux : ces maladies sont réelles, fréquentes et traitables. Briser le silence, c'est d'abord se permettre de dire « je ne vais pas bien » sans honte ni culpabilité. Partager avec un proche de confiance ou consulter un professionnel de santé mentale sont des actes de courage qui peuvent changer une vie. La santé mentale mérite la même attention que la santé physique.",
                'statut'                   => 'publie',
                'categorie_information_id' => $sante->id,
            ],
            [
                'titre'                    => 'Reconnaître les signes d\'un burn-out',
                'description'              => "Le burn-out, ou épuisement professionnel, se développe progressivement sous l'effet d'un stress chronique au travail. Ses signes précurseurs incluent une fatigue persistante malgré le repos, une perte de motivation et de plaisir, un cynisme croissant vis-à-vis de son travail, des difficultés de concentration et des maux physiques inexpliqués (maux de tête, troubles digestifs). Le burn-out n'est pas une faiblesse : c'est une réponse à une surcharge prolongée. Si vous vous reconnaissez dans ces symptômes, parlez-en à votre médecin traitant. Un arrêt de travail et un accompagnement psychologique peuvent être nécessaires pour se reconstruire.",
                'statut'                   => 'publie',
                'categorie_information_id' => $sante->id,
            ],
            [
                'titre'                    => 'Dépression saisonnière : comprendre et agir',
                'description'              => "Avec l'arrivée de l'automne et la réduction de l'ensoleillement, certaines personnes ressentent une baisse d'énergie, de l'irritabilité, une envie accrue de dormir et de manger des glucides. C'est la dépression saisonnière, aussi appelée trouble affectif saisonnier (TAS). La luminothérapie (exposition quotidienne à une lampe de 10 000 lux le matin) est le traitement de première intention. L'exercice physique régulier, une alimentation riche en oméga-3 et la vitamine D complètent l'arsenal thérapeutique. Si les symptômes sont sévères, un suivi médical et un traitement antidépresseur peuvent être envisagés.",
                'statut'                   => 'brouillon',
                'categorie_information_id' => $sante->id,
            ],
            [
                'titre'                    => 'Guide santé mentale en entreprise (édition 2019)',
                'description'              => "Ancienne version de notre guide destiné aux responsables RH sur la prévention des risques psychosociaux. Ce document, rédigé avant la crise sanitaire, a été remplacé par une version actualisée intégrant les problématiques du télétravail et du travail hybride. Conservé ici à des fins d'archivage.",
                'statut'                   => 'archive',
                'categorie_information_id' => $sante->id,
            ],

            // ─── Bien-être et relaxation ──────────────────────────────────────
            [
                'titre'                    => 'Pleine conscience (mindfulness) : guide pour débuter',
                'description'              => "La pleine conscience consiste à porter son attention, de façon intentionnelle et sans jugement, sur le moment présent. Issue des traditions méditatives bouddhistes, elle a été adaptée à la médecine occidentale par le Dr Jon Kabat-Zinn dans les années 1970. Des études rigoureuses montrent qu'une pratique régulière de 8 à 10 minutes par jour réduit l'anxiété, améliore la qualité du sommeil et augmente le bien-être général. Pour commencer, installez-vous confortablement, fermez les yeux et concentrez-vous sur votre respiration. Lorsque votre esprit s'égare, ramenez doucement votre attention sans vous juger. Des applications comme Petit Bambou ou Headspace peuvent vous accompagner.",
                'statut'                   => 'publie',
                'categorie_information_id' => $bienetre->id,
            ],
            [
                'titre'                    => 'Le yoga doux : bienfaits et postures de récupération',
                'description'              => "Le yoga doux, ou yoga restauratif, est une pratique accessible à tous, quel que soit l'âge ou la condition physique. Contrairement au yoga dynamique, il privilégie des postures maintenues plusieurs minutes, soutenues par des accessoires (bolsters, couvertures, blocs). Ses bienfaits sont nombreux : réduction du cortisol, amélioration de la flexibilité, soulagement des douleurs chroniques et régulation du système nerveux autonome. Parmi les postures les plus bénéfiques : la posture de l'enfant (Balasana), les jambes au mur (Viparita Karani) et la posture du cadavre (Savasana). Une pratique de 20 minutes avant le coucher améliore sensiblement la qualité du sommeil.",
                'statut'                   => 'publie',
                'categorie_information_id' => $bienetre->id,
            ],
            [
                'titre'                    => 'Bains de forêt (Shinrin-yoku) : la nature comme thérapie',
                'description'              => "Le Shinrin-yoku, ou « bain de forêt », est une pratique thérapeutique d'origine japonaise qui consiste à s'immerger dans un environnement forestier en sollicitant tous ses sens. Les recherches japonaises et coréennes montrent qu'une promenade de 2 heures en forêt abaisse la tension artérielle, réduit le cortisol et stimule les cellules NK (Natural Killer) du système immunitaire grâce aux phytoncides émis par les arbres. Il ne s'agit pas de faire de la randonnée sportive, mais de marcher lentement, de s'arrêter, d'observer, d'écouter et de respirer profondément. Un accès à un parc urbain arboré suffit pour commencer à en ressentir les bénéfices.",
                'statut'                   => 'brouillon',
                'categorie_information_id' => $bienetre->id,
            ],
            [
                'titre'                    => 'Aromathérapie anti-stress : les huiles essentielles (2018)',
                'description'              => "Cet article présentait une sélection d'huiles essentielles supposément efficaces contre le stress, sur la base d'études préliminaires disponibles en 2018. Depuis, certaines allégations ont été nuancées par de nouvelles méta-analyses. Cet article est archivé en attendant une révision complète conforme aux données scientifiques actuelles.",
                'statut'                   => 'archive',
                'categorie_information_id' => $bienetre->id,
            ],

            // ─── Prévention et hygiène de vie ─────────────────────────────────
            [
                'titre'                    => 'Le sommeil, pilier de la santé mentale',
                'description'              => "Le manque de sommeil et les troubles de l'humeur entretiennent un cercle vicieux bien documenté. Dormir moins de 7 heures par nuit augmente de 60 % le risque de dépression selon plusieurs études épidémiologiques. Pour une bonne hygiène du sommeil : maintenez des horaires réguliers, évitez les écrans au moins une heure avant le coucher, gardez votre chambre fraîche (18-19 °C) et sombre. Les rituels du soir (lecture, bain chaud, étirements légers) facilitent la transition veille-sommeil. Si des insomnies persistent depuis plus de 3 semaines, consultez un médecin pour écarter une cause organique ou initier une thérapie cognitivo-comportementale spécifique aux troubles du sommeil (TCC-I).",
                'statut'                   => 'publie',
                'categorie_information_id' => $prevention->id,
            ],
            [
                'titre'                    => 'Alimentation et humeur : ce que dit la science',
                'description'              => "Le microbiote intestinal, surnommé « deuxième cerveau », communique en permanence avec le système nerveux central via l'axe intestin-cerveau. Une alimentation riche en fibres (légumineuses, céréales complètes, légumes), en acides gras oméga-3 (poissons gras, noix, graines de chia) et en probiotiques naturels (yaourt, kéfir, choucroute) est associée à une réduction du risque de dépression. À l'inverse, une consommation élevée de sucres raffinés et d'ultra-transformés augmente l'inflammation systémique, facteur de risque des troubles de l'humeur. Même de petits ajustements alimentaires peuvent avoir un impact mesurable sur votre bien-être psychologique en quelques semaines.",
                'statut'                   => 'publie',
                'categorie_information_id' => $prevention->id,
            ],
            [
                'titre'                    => 'Sport et santé mentale : 30 minutes qui changent tout',
                'description'              => "L'activité physique régulière est l'un des antidépresseurs les plus puissants à notre disposition, et il est entièrement gratuit. Trente minutes d'exercice d'intensité modérée (marche rapide, vélo, natation) trois fois par semaine suffisent pour augmenter significativement les niveaux de sérotonine, de dopamine et d'endorphines. L'exercice réduit également les marqueurs biologiques du stress chronique et améliore la neuroplasticité. Vous n'avez pas besoin d'une salle de sport : montez les escaliers, marchez jusqu'à votre prochain arrêt, dansez dans votre cuisine. L'important est la régularité, pas l'intensité. Fixez-vous des objectifs réalistes et progressifs.",
                'statut'                   => 'brouillon',
                'categorie_information_id' => $prevention->id,
            ],
            [
                'titre'                    => 'Réduction des écrans : conseils pratiques (version 2021)',
                'description'              => "Cette version de notre guide sur la détox numérique a été rédigée avant la généralisation des réseaux sociaux en réalité augmentée et des nouvelles plateformes vidéo. Bien que les principes de base restent valides, une révision est en cours pour intégrer les recommandations les plus récentes concernant l'usage des smartphones et le temps d'écran chez les adultes.",
                'statut'                   => 'archive',
                'categorie_information_id' => $prevention->id,
            ],

            // ─── Ressources et aide professionnelle ──────────────────────────
            [
                'titre'                    => 'Quand et comment consulter un psychologue ?',
                'description'              => "Consulter un psychologue n'est pas réservé aux situations de crise. Vous pouvez y avoir recours pour mieux comprendre vos comportements, traverser une période difficile (deuil, séparation, surmenage), améliorer votre confiance en vous ou simplement vous connaître davantage. En France, le dispositif MonPsy permet de bénéficier de 8 séances remboursées par l'Assurance Maladie sur prescription médicale. Pour trouver un professionnel, vous pouvez consulter l'annuaire de la Fédération Française des Psychologues et de Psychologie (FFPP) ou la plateforme Doctolib. N'hésitez pas à essayer plusieurs thérapeutes : la qualité de l'alliance thérapeutique est déterminante pour le succès du suivi.",
                'statut'                   => 'publie',
                'categorie_information_id' => $ressources->id,
            ],
            [
                'titre'                    => 'Numéros d\'urgence et lignes d\'écoute en France',
                'description'              => "Si vous traversez une crise et avez besoin d'aide immédiate, plusieurs ressources sont disponibles 24h/24 et 7j/7. Le 3114 est le numéro national de prévention du suicide : des professionnels de santé formés répondent à toute heure pour vous écouter, vous orienter et vous soutenir. Le 15 (SAMU) et le 15 psychiatrique interviennent en cas d'urgence médicale. SOS Amitié (09 72 39 40 50) propose une écoute bienveillante et anonyme. La Croix-Rouge écoute (0800 858 858) et Fil Santé Jeunes (0800 235 236) complètent ce dispositif. En cas de danger immédiat pour vous ou pour autrui, composez le 15 ou le 112.",
                'statut'                   => 'publie',
                'categorie_information_id' => $ressources->id,
            ],
            [
                'titre'                    => 'Applications mobiles de santé mentale : le comparatif',
                'description'              => "Le marché des applications de bien-être mental a explosé ces dernières années. Parmi les plus reconnues : Calm et Headspace pour la méditation guidée, Petit Bambou pour les programmes de pleine conscience en français, Wysa pour le soutien émotionnel par chatbot, et Moodpath pour le suivi de l'humeur. Il est important de distinguer les applications grand public (relaxation, méditation) des outils cliniques validés scientifiquement. Aucune application ne remplace un suivi professionnel en cas de trouble mental avéré. Vérifiez toujours la politique de confidentialité avant de partager des données personnelles de santé.",
                'statut'                   => 'brouillon',
                'categorie_information_id' => $ressources->id,
            ],
            [
                'titre'                    => 'Annuaire des centres médico-psychologiques (CMP) — 2020',
                'description'              => "Cet annuaire recensait les centres médico-psychologiques disponibles par département en 2020. Les informations (adresses, horaires, coordonnées) sont susceptibles d'avoir changé. Nous recommandons de consulter l'annuaire officiel du Ministère de la Santé ou de contacter votre CPAM pour obtenir des informations à jour. Cet article est archivé.",
                'statut'                   => 'archive',
                'categorie_information_id' => $ressources->id,
            ],
        ];

        foreach ($pages as $pageData) {
            PageInformation::updateOrCreate(
                ['titre' => $pageData['titre']],
                array_merge($pageData, ['slug' => Str::slug($pageData['titre'])])
            );
        }

        $this->command->info('20 pages d\'information insérées (4 par catégorie : 2 publiées, 1 brouillon, 1 archivée).');
    }
}
