<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DiagnosticStress extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'date',
        'score',
        'details_resultats',
        'utilisateur_id',
        'administrateur_id',
    ];

    protected $table = 'diagnostic_stresses';
    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'date' => 'datetime',
            'score' => 'integer',
            'details_resultats' => 'array',
        ];
    }

    /**
     * Relations
     */

    // Utilisateur qui a réalisé ce diagnostic
    public function utilisateur()
    {
        return $this->belongsTo(User::class, 'utilisateur_id');
    }

    // Administrateur qui a configuré le questionnaire
    public function administrateur()
    {
        return $this->belongsTo(User::class, 'administrateur_id');
    }

    // Événements de vie sélectionnés (relation many-to-many)
    public function evenements()
    {
        return $this->belongsToMany(
            EvenementVie::class,
            'diagnostic_evenement',
            'diagnostic_stress_id',
            'evenement_vie_id'
        )->withPivot('date_selection');
    }

    // Historique des consultations
    public function historiques()
    {
        return $this->hasMany(HistoriqueDiagnostic::class, 'diagnostic_stress_id');
    }

    /**
     * Scopes
     */

    // Diagnostics récents (derniers 30 jours)
    public function scopeRecents($query)
    {
        return $query->where('date', '>=', now()->subDays(30));
    }

    // Diagnostics par utilisateur
    public function scopeParUtilisateur($query, $utilisateurId)
    {
        return $query->where('utilisateur_id', $utilisateurId);
    }

    // Diagnostics avec stress élevé (score > 300)
    public function scopeStressEleve($query)
    {
        return $query->where('score', '>', 300);
    }

    // Diagnostics avec stress modéré (150-300)
    public function scopeStressModere($query)
    {
        return $query->whereBetween('score', [150, 300]);
    }

    // Diagnostics avec stress faible (< 150)
    public function scopeStressFaible($query)
    {
        return $query->where('score', '<', 150);
    }

    /**
     * Méthodes de calcul
     */

    // Calculer le score total à partir des événements sélectionnés
    public function calculerScore()
    {
        $this->score = $this->evenements()->sum('points');
        $this->save();
        
        return $this->score;
    }

    // Ajouter un événement et recalculer le score
    public function ajouterEvenement($evenementId)
    {
        $this->evenements()->attach($evenementId, [
            'date_selection' => now()
        ]);
        
        return $this->calculerScore();
    }

    // Retirer un événement et recalculer le score
    public function retirerEvenement($evenementId)
    {
        $this->evenements()->detach($evenementId);
        
        return $this->calculerScore();
    }

    /**
     * Accesseurs
     */

    // Obtenir le niveau de stress en texte
    public function getNiveauStressAttribute()
    {
        if ($this->score >= 300) {
            return 'Élevé';
        } elseif ($this->score >= 150) {
            return 'Modéré';
        } else {
            return 'Faible';
        }
    }

    // Obtenir le message de recommandation
    public function getRecommandationAttribute()
    {
        $niveau = $this->niveau_stress;
        
        $recommendations = [
            'Élevé' => 'Votre niveau de stress est élevé. Il est fortement recommandé de consulter un professionnel de santé mentale.',
            'Modéré' => 'Votre niveau de stress est modéré. Pensez à prendre du temps pour vous et à pratiquer des activités relaxantes.',
            'Faible' => 'Votre niveau de stress est faible. Continuez à maintenir un bon équilibre de vie.'
        ];
        
        return $recommendations[$niveau] ?? 'Consultez un professionnel pour une analyse personnalisée.';
    }

    // Obtenir le nombre d'événements sélectionnés
    public function getNombreEvenementsAttribute()
    {
        return $this->evenements()->count();
    }

    /**
     * Méthodes statiques
     */

    // Créer un nouveau diagnostic pour un utilisateur
    public static function creerPourUtilisateur($utilisateurId, array $evenementIds = [])
    {
        $diagnostic = static::create([
            'date' => now(),
            'score' => 0,
            'utilisateur_id' => $utilisateurId,
        ]);

        if (!empty($evenementIds)) {
            $syncData = [];
            foreach ($evenementIds as $evenementId) {
                $syncData[$evenementId] = ['date_selection' => now()];
            }
            $diagnostic->evenements()->sync($syncData);
            $diagnostic->calculerScore();
        }

        return $diagnostic;
    }

    // Obtenir les statistiques de stress pour un utilisateur
    public static function statistiquesUtilisateur($utilisateurId)
    {
        $diagnostics = static::where('utilisateur_id', $utilisateurId)->get();
        
        return [
            'nombre_total' => $diagnostics->count(),
            'score_moyen' => $diagnostics->avg('score'),
            'score_max' => $diagnostics->max('score'),
            'score_min' => $diagnostics->min('score'),
            'dernier_diagnostic' => $diagnostics->sortByDesc('date')->first(),
        ];
    }
}
