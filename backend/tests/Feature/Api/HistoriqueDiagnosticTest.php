<?php

namespace Tests\Feature\Api;

use App\Models\DiagnosticStress;
use App\Models\HistoriqueDiagnostic;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class HistoriqueDiagnosticTest extends TestCase
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

    public function test_guest_cannot_access_historique_endpoints()
    {
        $this->getJson('/api/v1/historiques')->assertStatus(401);
        $this->postJson('/api/v1/historiques')->assertStatus(401);
        $this->deleteJson('/api/v1/historiques')->assertStatus(401);
        $this->getJson('/api/v1/historiques/recent')->assertStatus(401);
    }

    // --- Index Test ---

    public function test_user_can_list_their_own_history()
    {
        $diagnostic = DiagnosticStress::factory()->create(['utilisateur_id' => $this->user->id]);
        HistoriqueDiagnostic::factory()->count(2)->create([
            'utilisateur_id' => $this->user->id,
            'diagnostic_stress_id' => $diagnostic->id,
        ]);
        HistoriqueDiagnostic::factory()->create(['utilisateur_id' => $this->otherUser->id]);

        $response = $this->actingAs($this->user)->getJson('/api/v1/historiques');

        $response->assertStatus(200)
                 ->assertJsonCount(2, 'data');
    }

    // --- Store Test ---

    public function test_user_can_log_a_diagnostic_consultation()
    {
        $diagnostic = DiagnosticStress::factory()->create(['utilisateur_id' => $this->user->id]);

        $response = $this->actingAs($this->user)->postJson('/api/v1/historiques', [
            'diagnostic_stress_id' => $diagnostic->id,
        ]);

        $response->assertStatus(201)
                 ->assertJsonPath('historique.diagnostic_stress_id', $diagnostic->id);

        $this->assertDatabaseHas('historique_diagnostics', [
            'utilisateur_id' => $this->user->id,
            'diagnostic_stress_id' => $diagnostic->id,
        ]);
    }

    public function test_user_cannot_log_consultation_for_others_diagnostic()
    {
        $otherUsersDiagnostic = DiagnosticStress::factory()->create(['utilisateur_id' => $this->otherUser->id]);

        $response = $this->actingAs($this->user)->postJson('/api/v1/historiques', [
            'diagnostic_stress_id' => $otherUsersDiagnostic->id,
        ]);

        $response->assertStatus(404); // firstOrFail will trigger a 404
    }

    // --- Destroy Test ---

    public function test_user_can_delete_their_entire_history()
    {
        $diagnostic = DiagnosticStress::factory()->create(['utilisateur_id' => $this->user->id]);
        HistoriqueDiagnostic::factory()->count(3)->create([
            'utilisateur_id' => $this->user->id,
            'diagnostic_stress_id' => $diagnostic->id,
        ]);
        $this->assertDatabaseCount('historique_diagnostics', 3);

        // This test assumes DELETE /api/v1/historiques is routed to the destroy method.
        // This is a non-standard bulk delete.
        $response = $this->actingAs($this->user)->deleteJson("/api/v1/historiques");

        $response->assertStatus(200);
        $this->assertDatabaseCount('historique_diagnostics', 0);
    }

    // --- Recent Test ---

    public function test_recent_endpoint_returns_history_from_last_7_days()
    {
        $diagnostic = DiagnosticStress::factory()->create(['utilisateur_id' => $this->user->id]);
        HistoriqueDiagnostic::factory()->create([
            'utilisateur_id' => $this->user->id,
            'diagnostic_stress_id' => $diagnostic->id,
            'date_consultation' => now()->subDays(10),
        ]);
        $recentHistory = HistoriqueDiagnostic::factory()->create([
            'utilisateur_id' => $this->user->id,
            'diagnostic_stress_id' => $diagnostic->id,
            'date_consultation' => now()->subDays(2),
        ]);

        $response = $this->actingAs($this->user)->getJson('/api/v1/historiques/recent');

        $response->assertStatus(200)
                 ->assertJsonCount(1, 'historique')
                 ->assertJsonPath('historique.0.id', $recentHistory->id);
    }
}
