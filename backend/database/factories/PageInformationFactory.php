<?php

namespace Database\Factories;

use App\Models\CategorieInformation;
use App\Models\PageInformation;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class PageInformationFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = PageInformation::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'titre' => $this->faker->sentence,
            'description' => $this->faker->paragraph,
            'statut' => 'brouillon',
            'categorie_information_id' => CategorieInformation::factory(),
            'administrateur_id' => User::factory()->admin(),
        ];
    }
}
