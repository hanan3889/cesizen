<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HistoriqueDiagnostic extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'date_consultation',
        'utilisateur_id',
        'diagnostic_stress_id',
    ];

    protected $table = 'historique_diagnostics';

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'date_consultation' => 'datetime',
        ];
    }

    /**
     * Relations
     */

    // Utilisateur qui a consulté
    public function utilisateur()
    {
        return $this->belongsTo(User::class, 'utilisateur_id');
    }

    // Diagnostic consulté
    public function diagnostic()
    {
        return $this->belongsTo(DiagnosticStress::class, 'diagnostic_stress_id');
    }

    /**
     * Scopes
     */

    // Historique par utilisateur
    public function scopeParUtilisateur($query, $utilisateurId)
    {
        return $query->where('utilisateur_id', $utilisateurId);
    }

    // Historique récent (derniers 7 jours)
    public function scopeRecent($query)
    {
        return $query->where('date_consultation', '>=', now()->subDays(7));
    }

    // Trier par date de consultation (plus récent en premier)
    public function scopeDernierEnPremier($query)
    {
        return $query->orderBy('date_consultation', 'desc');
    }

    /**
     * Méthodes statiques
     */

    // Enregistrer une consultation
    public static function enregistrerConsultation($utilisateurId, $diagnosticId)
    {
        return static::create([
            'utilisateur_id' => $utilisateurId,
            'diagnostic_stress_id' => $diagnosticId,
            'date_consultation' => now(),
        ]);
    }

    // Obtenir l'historique complet d'un utilisateur
    public static function historiqueUtilisateur($utilisateurId)
    {
        return static::where('utilisateur_id', $utilisateurId)
                    ->with('diagnostic.evenements')
                    ->orderBy('date_consultation', 'desc')
                    ->get();
    }
}
