<?php

namespace Tests\Feature\Api;

use App\Models\DiagnosticConfig;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DiagnosticConfigTest extends TestCase
{
    use RefreshDatabase;

    // ── GET /diagnostic-config ───────────────────────────────

    public function test_anyone_can_get_config()
    {
        $response = $this->getJson('/api/v1/diagnostic-config');

        $response->assertStatus(200)
                 ->assertJsonStructure(['config' => ['faible', 'modere', 'eleve']]);
    }

    public function test_get_config_returns_defaults_when_table_empty()
    {
        $response = $this->getJson('/api/v1/diagnostic-config');

        $response->assertStatus(200)
                 ->assertJsonPath('config.faible.seuil_min', 0)
                 ->assertJsonPath('config.modere.seuil_min', 150)
                 ->assertJsonPath('config.eleve.seuil_min', 300);
    }

    public function test_get_config_returns_db_values_when_seeded()
    {
        DiagnosticConfig::create(['niveau' => 'faible', 'seuil_min' => 0,   'seuil_max' => 200,  'message' => 'Msg faible']);
        DiagnosticConfig::create(['niveau' => 'modere', 'seuil_min' => 200,  'seuil_max' => 400,  'message' => 'Msg modere']);
        DiagnosticConfig::create(['niveau' => 'eleve',  'seuil_min' => 400,  'seuil_max' => null, 'message' => 'Msg eleve']);

        $response = $this->getJson('/api/v1/diagnostic-config');

        $response->assertStatus(200)
                 ->assertJsonPath('config.faible.seuil_max', 200)
                 ->assertJsonPath('config.modere.seuil_min', 200)
                 ->assertJsonPath('config.eleve.seuil_min', 400);
    }

    // ── PUT /diagnostic-config/{niveau} ──────────────────────

    public function test_guest_cannot_update_config()
    {
        $this->putJson('/api/v1/diagnostic-config/faible', [
            'seuil_min' => 0,
            'seuil_max' => 150,
            'message'   => 'Test',
        ])->assertStatus(401);
    }

    public function test_non_admin_cannot_update_config()
    {
        $user = User::factory()->create();

        $this->actingAs($user)->putJson('/api/v1/diagnostic-config/faible', [
            'seuil_min' => 0,
            'seuil_max' => 150,
            'message'   => 'Test',
        ])->assertStatus(403);
    }

    public function test_admin_can_update_faible_config()
    {
        $admin = User::factory()->admin()->create();

        $response = $this->actingAs($admin)->putJson('/api/v1/diagnostic-config/faible', [
            'seuil_min' => 0,
            'seuil_max' => 120,
            'message'   => 'Nouveau message faible',
        ]);

        $response->assertStatus(200)
                 ->assertJsonPath('config.seuil_min', 0)
                 ->assertJsonPath('config.seuil_max', 120)
                 ->assertJsonPath('config.message', 'Nouveau message faible');

        $this->assertDatabaseHas('diagnostic_configs', [
            'niveau'    => 'faible',
            'seuil_min' => 0,
            'seuil_max' => 120,
            'message'   => 'Nouveau message faible',
        ]);
    }

    public function test_admin_can_update_eleve_config_without_seuil_max()
    {
        $admin = User::factory()->admin()->create();

        $response = $this->actingAs($admin)->putJson('/api/v1/diagnostic-config/eleve', [
            'seuil_min' => 350,
            'message'   => 'Nouveau message élevé',
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('diagnostic_configs', [
            'niveau'    => 'eleve',
            'seuil_min' => 350,
            'seuil_max' => null,
        ]);
    }

    public function test_update_config_validates_seuil_max_greater_than_seuil_min()
    {
        $admin = User::factory()->admin()->create();

        $this->actingAs($admin)->putJson('/api/v1/diagnostic-config/modere', [
            'seuil_min' => 200,
            'seuil_max' => 100, // inférieur à seuil_min
            'message'   => 'Test',
        ])->assertStatus(422)
          ->assertJsonValidationErrors('seuil_max');
    }

    public function test_update_config_requires_message()
    {
        $admin = User::factory()->admin()->create();

        $this->actingAs($admin)->putJson('/api/v1/diagnostic-config/faible', [
            'seuil_min' => 0,
            'seuil_max' => 150,
        ])->assertStatus(422)
          ->assertJsonValidationErrors('message');
    }

    public function test_invalid_niveau_returns_422()
    {
        $admin = User::factory()->admin()->create();

        $this->actingAs($admin)->putJson('/api/v1/diagnostic-config/inconnu', [
            'seuil_min' => 0,
            'message'   => 'Test',
        ])->assertStatus(422);
    }

    public function test_update_creates_row_if_not_exists()
    {
        $admin = User::factory()->admin()->create();

        $this->assertDatabaseEmpty('diagnostic_configs');

        $this->actingAs($admin)->putJson('/api/v1/diagnostic-config/modere', [
            'seuil_min' => 150,
            'seuil_max' => 300,
            'message'   => 'Créé',
        ])->assertStatus(200);

        $this->assertDatabaseCount('diagnostic_configs', 1);
    }
}
