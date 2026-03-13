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

    // --- Admin CRUD Tests ---

    public function test_guest_cannot_create_an_event()
    {
        $this->postJson('/api/v1/evenements', [
            'type_evenement' => 'Mariage',
            'points'         => 50,
        ])->assertStatus(401);
    }

    public function test_non_admin_cannot_create_an_event()
    {
        $user = \App\Models\User::factory()->create();
        $this->actingAs($user)->postJson('/api/v1/evenements', [
            'type_evenement' => 'Mariage',
            'points'         => 50,
        ])->assertStatus(403);
    }

    public function test_admin_can_create_an_event()
    {
        $admin = \App\Models\User::factory()->admin()->create();
        $response = $this->actingAs($admin)->postJson('/api/v1/evenements', [
            'type_evenement' => 'Nouveau départ professionnel',
            'points'         => 47,
        ]);

        $response->assertStatus(201)
                 ->assertJsonPath('evenement.type_evenement', 'Nouveau départ professionnel');
        $this->assertDatabaseHas('evenement_vies', ['type_evenement' => 'Nouveau départ professionnel']);
    }

    public function test_create_event_fails_with_missing_fields()
    {
        $admin = \App\Models\User::factory()->admin()->create();
        $this->actingAs($admin)->postJson('/api/v1/evenements', [])
             ->assertStatus(422)
             ->assertJsonValidationErrors(['type_evenement', 'points']);
    }

    public function test_create_event_fails_with_invalid_points()
    {
        $admin = \App\Models\User::factory()->admin()->create();
        $this->actingAs($admin)->postJson('/api/v1/evenements', [
            'type_evenement' => 'Evenement invalide',
            'points'         => 0,
        ])->assertStatus(422)->assertJsonValidationErrors('points');
    }

    public function test_create_event_fails_with_duplicate_type()
    {
        $admin = \App\Models\User::factory()->admin()->create();
        $event = EvenementVie::factory()->create(['type_evenement' => 'Naissance enfant']);

        $this->actingAs($admin)->postJson('/api/v1/evenements', [
            'type_evenement' => $event->type_evenement,
            'points'         => 39,
        ])->assertStatus(422)->assertJsonValidationErrors('type_evenement');
    }

    public function test_guest_cannot_update_an_event()
    {
        $event = EvenementVie::factory()->create();
        $this->putJson("/api/v1/evenements/{$event->id}", [
            'type_evenement' => 'Updated',
            'points'         => 50,
        ])->assertStatus(401);
    }

    public function test_non_admin_cannot_update_an_event()
    {
        $user  = \App\Models\User::factory()->create();
        $event = EvenementVie::factory()->create();
        $this->actingAs($user)->putJson("/api/v1/evenements/{$event->id}", [
            'type_evenement' => 'Updated',
            'points'         => 50,
        ])->assertStatus(403);
    }

    public function test_admin_can_update_an_event()
    {
        $admin = \App\Models\User::factory()->admin()->create();
        $event = EvenementVie::factory()->create();

        $response = $this->actingAs($admin)->putJson("/api/v1/evenements/{$event->id}", [
            'type_evenement' => 'Retraite anticipée',
            'points'         => 45,
        ]);

        $response->assertStatus(200)
                 ->assertJsonPath('evenement.type_evenement', 'Retraite anticipée');
        $this->assertDatabaseHas('evenement_vies', ['id' => $event->id, 'points' => 45]);
    }

    public function test_admin_gets_404_when_updating_non_existent_event()
    {
        $admin = \App\Models\User::factory()->admin()->create();
        $this->actingAs($admin)->putJson('/api/v1/evenements/99999', [
            'type_evenement' => 'Ghost',
            'points'         => 10,
        ])->assertStatus(404);
    }

    public function test_guest_cannot_delete_an_event()
    {
        $event = EvenementVie::factory()->create();
        $this->deleteJson("/api/v1/evenements/{$event->id}")->assertStatus(401);
    }

    public function test_non_admin_cannot_delete_an_event()
    {
        $user  = \App\Models\User::factory()->create();
        $event = EvenementVie::factory()->create();
        $this->actingAs($user)->deleteJson("/api/v1/evenements/{$event->id}")->assertStatus(403);
    }

    public function test_admin_can_delete_an_event()
    {
        $admin = \App\Models\User::factory()->admin()->create();
        $event = EvenementVie::factory()->create();

        $this->actingAs($admin)->deleteJson("/api/v1/evenements/{$event->id}")->assertStatus(200);
        $this->assertDatabaseMissing('evenement_vies', ['id' => $event->id]);
    }

    public function test_admin_gets_404_when_deleting_non_existent_event()
    {
        $admin = \App\Models\User::factory()->admin()->create();
        $this->actingAs($admin)->deleteJson('/api/v1/evenements/99999')->assertStatus(404);
    }
}
