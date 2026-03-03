<?php

namespace Tests\Feature\Api;

use App\Models\EvenementVie;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EvenementVieTest extends TestCase
{
    use RefreshDatabase;

    // --- Index Tests ---

    public function test_it_returns_a_list_of_events()
    {
        EvenementVie::factory()->count(5)->create();
        $response = $this->getJson('/api/v1/evenements');
        $response->assertStatus(200)
                 ->assertJsonCount(5, 'evenements');
    }

    public function test_it_filters_events_by_high_impact()
    {
        EvenementVie::factory()->create(['points' => 30]); // moyen
        EvenementVie::factory()->create(['points' => 70]); // eleve

        $response = $this->getJson('/api/v1/evenements?impact=eleve');
        $response->assertStatus(200)
                 ->assertJsonCount(1, 'evenements')
                 ->assertJsonPath('evenements.0.points', 70);
    }

    public function test_it_filters_events_by_medium_impact()
    {
        EvenementVie::factory()->create(['points' => 10]); // faible
        EvenementVie::factory()->create(['points' => 40]); // moyen

        $response = $this->getJson('/api/v1/evenements?impact=moyen');
        $response->assertStatus(200)
                 ->assertJsonCount(1, 'evenements')
                 ->assertJsonPath('evenements.0.points', 40);
    }

    public function test_it_filters_events_by_low_impact()
    {
        EvenementVie::factory()->create(['points' => 15]); // faible
        EvenementVie::factory()->create(['points' => 60]); // eleve

        $response = $this->getJson('/api/v1/evenements?impact=faible');
        $response->assertStatus(200)
                 ->assertJsonCount(1, 'evenements')
                 ->assertJsonPath('evenements.0.points', 15);
    }

    public function test_it_sorts_events_by_points_ascending()
    {
        EvenementVie::factory()->create(['points' => 50]);
        EvenementVie::factory()->create(['points' => 20]);

        $response = $this->getJson('/api/v1/evenements?ordre=asc');
        $response->assertStatus(200);
        $this->assertEquals(20, $response->json('evenements.0.points'));
        $this->assertEquals(50, $response->json('evenements.1.points'));
    }

    // --- Show Tests ---

    public function test_it_returns_a_single_event()
    {
        $event = EvenementVie::factory()->create();
        $response = $this->getJson("/api/v1/evenements/{$event->id}");
        $response->assertStatus(200)
                 ->assertJsonPath('evenement.id', $event->id);
    }

    public function test_it_returns_404_for_non_existent_event()
    {
        $response = $this->getJson('/api/v1/evenements/999');
        $response->assertStatus(404);
    }

    // --- Search Tests ---

    public function test_it_searches_events_by_keyword()
    {
        EvenementVie::factory()->create(['type_evenement' => 'Mariage heureux']);
        EvenementVie::factory()->create(['type_evenement' => 'Divorce difficile']);

        $response = $this->getJson('/api/v1/evenements/search?q=Mariage');
        $response->assertStatus(200)
                 ->assertJsonCount(1, 'evenements')
                 ->assertJsonPath('evenements.0.type_evenement', 'Mariage heureux');
    }

    public function test_search_returns_empty_for_no_match()
    {
        EvenementVie::factory()->create(['type_evenement' => 'Mariage heureux']);
        $response = $this->getJson('/api/v1/evenements/search?q=Inexistant');
        $response->assertStatus(200)
                 ->assertJsonCount(0, 'evenements');
    }

    public function test_search_validates_query_parameter()
    {
        // Missing 'q'
        $response = $this->getJson('/api/v1/evenements/search');
        $response->assertStatus(422);

        // 'q' is too short
        $response = $this->getJson('/api/v1/evenements/search?q=a');
        $response->assertStatus(422);
    }
}
