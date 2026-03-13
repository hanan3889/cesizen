<?php

namespace Tests\Feature\Api;

use App\Models\DiagnosticStress;
use App\Models\EvenementVie;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DiagnosticStressTest extends TestCase
{
    use RefreshDatabase;

    private $user;
    private $otherUser;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
        $this->otherUser = User::factory()->create();
    }

    // --- Authentication Tests ---

    public function test_guest_cannot_access_diagnostic_endpoints()
    {
        $this->getJson('/api/v1/diagnostics')->assertStatus(401);
        $this->getJson('/api/v1/diagnostics/1')->assertStatus(401);
        $this->postJson('/api/v1/diagnostics')->assertStatus(401);
        $this->deleteJson('/api/v1/diagnostics/1')->assertStatus(401);
        $this->getJson('/api/v1/diagnostics/recents')->assertStatus(401);
        $this->getJson('/api/v1/diagnostics/statistiques')->assertStatus(401);
    }

    // --- Index / Show Tests ---

    public function test_user_can_list_their_own_diagnostics()
    {
        DiagnosticStress::factory()->count(2)->create(['utilisateur_id' => $this->user->id]);
        DiagnosticStress::factory()->count(3)->create(['utilisateur_id' => $this->otherUser->id]);

        $response = $this->actingAs($this->user)->getJson('/api/v1/diagnostics');

        $response->assertStatus(200)
                 ->assertJsonCount(2, 'data');
    }

    public function test_user_can_view_their_own_diagnostic()
    {
        $diagnostic = DiagnosticStress::factory()->create(['utilisateur_id' => $this->user->id]);

        $response = $this->actingAs($this->user)->getJson("/api/v1/diagnostics/{$diagnostic->id}");

        $response->assertStatus(200)
                 ->assertJsonPath('diagnostic.id', $diagnostic->id);
    }

    public function test_user_cannot_view_another_users_diagnostic()
    {
        $diagnostic = DiagnosticStress::factory()->create(['utilisateur_id' => $this->otherUser->id]);

        $response = $this->actingAs($this->user)->getJson("/api/v1/diagnostics/{$diagnostic->id}");

        $response->assertStatus(404);
    }

    // --- Store Tests ---

    public function test_user_can_create_a_diagnostic()
    {
        $event1 = EvenementVie::factory()->create(['points' => 50]);
        $event2 = EvenementVie::factory()->create(['points' => 30]);

        $response = $this->actingAs($this->user)->postJson('/api/v1/diagnostics', [
            'evenements' => [$event1->id, $event2->id],
        ]);

        $response->assertStatus(201)
                 ->assertJsonPath('diagnostic.score', 80);

        $this->assertDatabaseHas('diagnostic_stresses', [
            'utilisateur_id' => $this->user->id,
            'score' => 80,
        ]);
        $this->assertDatabaseCount('diagnostic_evenement', 2);
    }

    public function test_store_validates_events_input()
    {
        $response = $this->actingAs($this->user)->postJson('/api/v1/diagnostics', [
            'evenements' => [999], // Non-existent event
        ]);
        $response->assertStatus(422);
    }

    // --- Update Tests ---

    public function test_user_can_update_their_own_diagnostic()
    {
        $diagnostic = DiagnosticStress::factory()->create(['utilisateur_id' => $this->user->id]);
        $event1     = EvenementVie::factory()->create(['points' => 40]);
        $event2     = EvenementVie::factory()->create(['points' => 60]);

        $response = $this->actingAs($this->user)->putJson("/api/v1/diagnostics/{$diagnostic->id}", [
            'evenements' => [$event1->id, $event2->id],
        ]);

        $response->assertStatus(200)
                 ->assertJsonPath('diagnostic.score', 100);
    }

    public function test_user_cannot_update_another_users_diagnostic()
    {
        $diagnostic = DiagnosticStress::factory()->create(['utilisateur_id' => $this->otherUser->id]);
        $event      = EvenementVie::factory()->create();

        $response = $this->actingAs($this->user)->putJson("/api/v1/diagnostics/{$diagnostic->id}", [
            'evenements' => [$event->id],
        ]);

        $response->assertStatus(404);
    }

    // --- Destroy Tests ---

    public function test_user_can_delete_their_own_diagnostic()
    {
        $diagnostic = DiagnosticStress::factory()->create(['utilisateur_id' => $this->user->id]);

        $response = $this->actingAs($this->user)->deleteJson("/api/v1/diagnostics/{$diagnostic->id}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('diagnostic_stresses', ['id' => $diagnostic->id]);
    }

    public function test_user_cannot_delete_another_users_diagnostic()
    {
        $diagnostic = DiagnosticStress::factory()->create(['utilisateur_id' => $this->otherUser->id]);

        $response = $this->actingAs($this->user)->deleteJson("/api/v1/diagnostics/{$diagnostic->id}");

        $response->assertStatus(404);
    }

    // --- Custom Routes Tests ---

    public function test_recents_endpoint_returns_recent_diagnostics()
    {
        DiagnosticStress::factory()->create([
            'utilisateur_id' => $this->user->id,
            'date' => now()->subDays(40)
        ]);
        $recentDiagnostic = DiagnosticStress::factory()->create([
            'utilisateur_id' => $this->user->id,
            'date' => now()->subDays(10)
        ]);

        $response = $this->actingAs($this->user)->getJson('/api/v1/diagnostics/recents');

        $response->assertStatus(200)
                 ->assertJsonCount(1, 'diagnostics')
                 ->assertJsonPath('diagnostics.0.id', $recentDiagnostic->id);
    }

    public function test_statistiques_endpoint_returns_correct_stats()
    {
        DiagnosticStress::factory()->create(['utilisateur_id' => $this->user->id, 'score' => 100]);
        DiagnosticStress::factory()->create(['utilisateur_id' => $this->user->id, 'score' => 200]);

        $response = $this->actingAs($this->user)->getJson('/api/v1/diagnostics/statistiques');

        $response->assertStatus(200)
                 ->assertJson([
                     'statistiques' => [
                         'nombre_total' => 2,
                         'score_moyen' => 150,
                         'score_max' => 200,
                         'score_min' => 100,
                     ]
                 ]);
    }
}
