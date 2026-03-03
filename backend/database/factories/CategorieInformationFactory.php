<?php

namespace Database\Factories;

use App\Models\CategorieInformation;
use Illuminate\Database\Eloquent\Factories\Factory;

class CategorieInformationFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = CategorieInformation::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'categorie' => $this->faker->unique()->word(),
        ];
    }
}
