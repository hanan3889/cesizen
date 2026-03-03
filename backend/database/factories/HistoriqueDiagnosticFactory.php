<?php

namespace Database\Factories;

use App\Models\DiagnosticStress;
use App\Models\HistoriqueDiagnostic;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class HistoriqueDiagnosticFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = HistoriqueDiagnostic::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'date_consultation' => $this->faker->dateTimeThisMonth(),
            'utilisateur_id' => User::factory(),
            'diagnostic_stress_id' => DiagnosticStress::factory(),
        ];
    }
}
