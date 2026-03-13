<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class DiagnosticConfig extends Model
{
    protected $fillable = ['niveau', 'seuil_min', 'seuil_max', 'message'];

    protected $table = 'diagnostic_configs';

    protected function casts(): array
    {
        return [
            'seuil_min' => 'integer',
            'seuil_max' => 'integer',
        ];
    }

    /**
     * Récupère toutes les configs indexées par niveau, avec cache.
     */
    public static function getAll(): \Illuminate\Database\Eloquent\Collection
    {
        return Cache::remember('diagnostic_configs', 3600, function () {
            return static::all()->keyBy('niveau');
        });
    }

    /**
     * Retourne le seuil_min d'un niveau (avec valeur par défaut si non configuré).
     */
    public static function getSeuil(string $niveau, int $default): int
    {
        $configs = static::getAll();

        return $configs->has($niveau) ? (int) $configs->get($niveau)->seuil_min : $default;
    }

    /**
     * Retourne le message d'un niveau (avec valeur par défaut si non configuré).
     */
    public static function getMessage(string $niveau, string $default): string
    {
        $configs = static::getAll();

        return $configs->has($niveau) ? $configs->get($niveau)->message : $default;
    }

    /**
     * Invalide le cache (à appeler après chaque mise à jour).
     */
    public static function clearCache(): void
    {
        Cache::forget('diagnostic_configs');
    }
}
