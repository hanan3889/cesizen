<?php

namespace Database\Factories;

use App\Models\EvenementVie;
use Illuminate\Database\Eloquent\Factories\Factory;

class EvenementVieFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = EvenementVie::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'type_evenement' => $this->faker->unique()->sentence(3),
            'points' => $this->faker->numberBetween(1, 100),
        ];
    }
}
