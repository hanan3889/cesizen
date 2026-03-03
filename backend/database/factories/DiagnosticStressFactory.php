<?php

namespace Database\Factories;

use App\Models\DiagnosticStress;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class DiagnosticStressFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = DiagnosticStress::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'date' => $this->faker->dateTimeThisYear(),
            'score' => $this->faker->numberBetween(50, 400),
            'details_resultats' => null,
            'utilisateur_id' => User::factory(),
            'administrateur_id' => null,
        ];
    }
}
