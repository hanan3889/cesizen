<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PageInformation extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'titre',
        'description',
        'statut',
        'categorie_information_id',
        'administrateur_id',
    ];
    protected $table = 'page_informations';

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    /**
     * Relations
     */

    // Catégorie de cette page
    public function categorie()
    {
        return $this->belongsTo(CategorieInformation::class, 'categorie_information_id');
    }

    // Administrateur qui gère cette page
    public function administrateur()
    {
        return $this->belongsTo(User::class, 'administrateur_id');
    }

    /**
     * Scopes
     */

    // Récupérer seulement les pages publiées
    public function scopePubliees($query)
    {
        return $query->where('statut', 'publie');
    }

    // Récupérer seulement les brouillons
    public function scopeBrouillons($query)
    {
        return $query->where('statut', 'brouillon');
    }

    // Récupérer seulement les pages archivées
    public function scopeArchivees($query)
    {
        return $query->where('statut', 'archive');
    }

    // Filtrer par catégorie
    public function scopeParCategorie($query, $categorieId)
    {
        return $query->where('categorie_information_id', $categorieId);
    }

    /**
     * Méthodes utilitaires
     */

    // Publier la page
    public function publier()
    {
        $this->statut = 'publie';
        return $this->save();
    }

    // Archiver la page
    public function archiver()
    {
        $this->statut = 'archive';
        return $this->save();
    }

    // Mettre en brouillon
    public function mettreEnBrouillon()
    {
        $this->statut = 'brouillon';
        return $this->save();
    }

    // Vérifier si la page est publiée
    public function estPubliee()
    {
        return $this->statut === 'publie';
    }
}
