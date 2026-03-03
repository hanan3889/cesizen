<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CategorieInformation extends Model
{
    use HasFactory;

    /**
     * Le nom de la table associée au modèle.
     */
    protected $table = 'categorie_informations';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'categorie',
    ];

    /**
     * Relations
     */

    // Pages appartenant à cette catégorie
    public function pages()
    {
        return $this->hasMany(PageInformation::class, 'categorie_information_id');
    }

    // Pages publiées dans cette catégorie
    public function pagesPubliees()
    {
        return $this->hasMany(PageInformation::class, 'categorie_information_id')
                    ->where('statut', 'publie');
    }

    /**
     * Accesseurs
     */

    // Compter le nombre de pages dans cette catégorie
    public function getNombrePagesAttribute()
    {
        return $this->pages()->count();
    }

    // Compter le nombre de pages publiées
    public function getNombrePagesPublieesAttribute()
    {
        return $this->pagesPubliees()->count();
    }
}
