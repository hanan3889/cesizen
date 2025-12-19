<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EvenementVie extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'type_evenement',
        'points',
    ];

    protected $table = 'evenement_vies';
    
    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'points' => 'integer',
        ];
    }

    /**
     * Relations
     */

    // Diagnostics qui contiennent cet événement (relation many-to-many)
    public function diagnostics()
    {
        return $this->belongsToMany(
            DiagnosticStress::class,
            'diagnostic_evenement',
            'evenement_vie_id',
            'diagnostic_stress_id'
        )->withPivot('date_selection');
    }

    /**
     * Scopes
     */

    // Trier par points (du plus élevé au plus faible)
    public function scopeParPointsDesc($query)
    {
        return $query->orderBy('points', 'desc');
    }

    // Trier par points (du plus faible au plus élevé)
    public function scopeParPointsAsc($query)
    {
        return $query->orderBy('points', 'asc');
    }

    // Événements avec points élevés (> 50)
    public function scopeImpactElevé($query)
    {
        return $query->where('points', '>', 50);
    }

    // Événements avec points moyens (entre 20 et 50)
    public function scopeImpactMoyen($query)
    {
        return $query->whereBetween('points', [20, 50]);
    }

    // Événements avec points faibles (< 20)
    public function scopeImpactFaible($query)
    {
        return $query->where('points', '<', 20);
    }

    /**
     * Accesseurs
     */

    // Obtenir le niveau d'impact en texte
    public function getNiveauImpactAttribute()
    {
        if ($this->points > 50) {
            return 'Élevé';
        } elseif ($this->points >= 20) {
            return 'Moyen';
        } else {
            return 'Faible';
        }
    }

    /**
     * Méthodes statiques utilitaires
     */

    // Obtenir tous les événements triés par points
    public static function tousParPoints()
    {
        return static::orderBy('points', 'desc')->get();
    }

    // Obtenir les 43 événements de Holmes-Rahe
    public static function evenementsHolmesRahe()
    {
        return static::all();
    }
}
