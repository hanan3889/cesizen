<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Vérifier si l'utilisateur est administrateur
     */
    public function isAdmin(): bool
    {
        return $this->role === 'administrateur';
    }

    /**
     * Vérifier si l'utilisateur est un utilisateur standard
     */
    public function isUser(): bool
    {
        return $this->role === 'utilisateur';
    }

    /**
     * Relations
     */

    // Pages gérées par cet administrateur
    public function pagesGerees()
    {
        return $this->hasMany(PageInformation::class, 'administrateur_id');
    }

    // Diagnostics réalisés par cet utilisateur
    public function diagnostics()
    {
        return $this->hasMany(DiagnosticStress::class, 'utilisateur_id');
    }

    // Diagnostics configurés par cet administrateur
    public function diagnosticsConfigures()
    {
        return $this->hasMany(DiagnosticStress::class, 'administrateur_id');
    }

    // Historique des consultations de diagnostics
    public function historiqueDiagnostics()
    {
        return $this->hasMany(HistoriqueDiagnostic::class, 'utilisateur_id');
    }

    /**
     * Scopes
     */

    // Récupérer seulement les administrateurs
    public function scopeAdministrateurs($query)
    {
        return $query->where('role', 'administrateur');
    }

    // Récupérer seulement les utilisateurs standards
    public function scopeUtilisateurs($query)
    {
        return $query->where('role', 'utilisateur');
    }
}
