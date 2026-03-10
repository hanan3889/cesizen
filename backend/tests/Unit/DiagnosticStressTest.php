<?php

namespace Tests\Unit;

use App\Models\DiagnosticStress;
use App\Models\EvenementVie;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DiagnosticStressTest extends TestCase
{
    use RefreshDatabase;

    // ── Accesseur : niveau_stress ─────────────────────────────

    public function test_niveau_stress_returns_eleve_when_score_above_or_equal_300(): void
    {
        $diagnostic = DiagnosticStress::factory()->create(['score' => 300]);
        $this->assertEquals('Élevé', $diagnostic->niveau_stress);

        $diagnostic2 = DiagnosticStress::factory()->create(['score' => 450]);
        $this->assertEquals('Élevé', $diagnostic2->niveau_stress);
    }

    public function test_niveau_stress_returns_modere_when_score_between_150_and_299(): void
    {
        $diagnostic = DiagnosticStress::factory()->create(['score' => 150]);
        $this->assertEquals('Modéré', $diagnostic->niveau_stress);

        $diagnostic2 = DiagnosticStress::factory()->create(['score' => 250]);
        $this->assertEquals('Modéré', $diagnostic2->niveau_stress);
    }

    public function test_niveau_stress_returns_faible_when_score_below_150(): void
    {
        $diagnostic = DiagnosticStress::factory()->create(['score' => 100]);
        $this->assertEquals('Faible', $diagnostic->niveau_stress);

        $diagnostic2 = DiagnosticStress::factory()->create(['score' => 0]);
        $this->assertEquals('Faible', $diagnostic2->niveau_stress);
    }

    // ── Accesseur : recommandation ────────────────────────────

    public function test_recommandation_contains_text_for_faible(): void
    {
        $diagnostic = DiagnosticStress::factory()->create(['score' => 50]);
        $this->assertNotEmpty($diagnostic->recommandation);
        $this->assertStringContainsStringIgnoringCase('faible', $diagnostic->recommandation);
    }

    public function test_recommandation_contains_text_for_modere(): void
    {
        $diagnostic = DiagnosticStress::factory()->create(['score' => 200]);
        $this->assertNotEmpty($diagnostic->recommandation);
        $this->assertStringContainsStringIgnoringCase('modéré', $diagnostic->recommandation);
    }

    public function test_recommandation_contains_text_for_eleve(): void
    {
        $diagnostic = DiagnosticStress::factory()->create(['score' => 350]);
        $this->assertNotEmpty($diagnostic->recommandation);
        $this->assertStringContainsStringIgnoringCase('élevé', $diagnostic->recommandation);
    }

    // ── Accesseur : nombre_evenements ────────────────────────

    public function test_nombre_evenements_returns_count_of_linked_events(): void
    {
        $diagnostic = DiagnosticStress::factory()->create();
        $events     = EvenementVie::factory()->count(3)->create();

        $diagnostic->evenements()->attach($events->pluck('id')->toArray(), ['date_selection' => now()]);

        $this->assertEquals(3, $diagnostic->nombre_evenements);
    }

    public function test_nombre_evenements_returns_zero_when_no_events(): void
    {
        $diagnostic = DiagnosticStress::factory()->create();

        $this->assertEquals(0, $diagnostic->nombre_evenements);
    }

    // ── calculerScore ─────────────────────────────────────────

    public function test_calculer_score_sums_points_of_attached_events(): void
    {
        $diagnostic = DiagnosticStress::factory()->create(['score' => 0]);
        $e1 = EvenementVie::factory()->create(['points' => 70]);
        $e2 = EvenementVie::factory()->create(['points' => 30]);
        $diagnostic->evenements()->attach([$e1->id, $e2->id], ['date_selection' => now()]);

        $score = $diagnostic->calculerScore();

        $this->assertEquals(100, $score);
        $this->assertEquals(100, $diagnostic->fresh()->score);
    }

    public function test_calculer_score_returns_zero_with_no_events(): void
    {
        $diagnostic = DiagnosticStress::factory()->create(['score' => 0]);

        $score = $diagnostic->calculerScore();

        $this->assertEquals(0, $score);
    }

    // ── creerPourUtilisateur ──────────────────────────────────

    public function test_creer_pour_utilisateur_creates_diagnostic_and_calculates_score(): void
    {
        $user = User::factory()->create();
        $e1   = EvenementVie::factory()->create(['points' => 50]);
        $e2   = EvenementVie::factory()->create(['points' => 25]);

        $diagnostic = DiagnosticStress::creerPourUtilisateur($user->id, [$e1->id, $e2->id]);

        $this->assertDatabaseHas('diagnostic_stresses', [
            'utilisateur_id' => $user->id,
            'score'          => 75,
        ]);
        $this->assertCount(2, $diagnostic->evenements);
    }

    public function test_creer_pour_utilisateur_creates_diagnostic_with_zero_score_when_no_events(): void
    {
        $user = User::factory()->create();

        $diagnostic = DiagnosticStress::creerPourUtilisateur($user->id, []);

        $this->assertDatabaseHas('diagnostic_stresses', [
            'utilisateur_id' => $user->id,
            'score'          => 0,
        ]);
    }

    // ── statistiquesUtilisateur ───────────────────────────────

    public function test_statistiques_utilisateur_returns_correct_values(): void
    {
        $user = User::factory()->create();
        DiagnosticStress::factory()->create(['utilisateur_id' => $user->id, 'score' => 100]);
        DiagnosticStress::factory()->create(['utilisateur_id' => $user->id, 'score' => 200]);
        DiagnosticStress::factory()->create(['utilisateur_id' => $user->id, 'score' => 300]);

        $stats = DiagnosticStress::statistiquesUtilisateur($user->id);

        $this->assertEquals(3,   $stats['nombre_total']);
        $this->assertEquals(200, $stats['score_moyen']);
        $this->assertEquals(100, $stats['score_min']);
        $this->assertEquals(300, $stats['score_max']);
    }

    public function test_statistiques_utilisateur_returns_zero_for_user_without_diagnostics(): void
    {
        $user = User::factory()->create();

        $stats = DiagnosticStress::statistiquesUtilisateur($user->id);

        $this->assertEquals(0, $stats['nombre_total']);
        $this->assertNull($stats['score_moyen']);
        $this->assertNull($stats['score_min']);
        $this->assertNull($stats['score_max']);
    }

    public function test_statistiques_are_isolated_per_user(): void
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();
        DiagnosticStress::factory()->create(['utilisateur_id' => $user1->id, 'score' => 400]);
        DiagnosticStress::factory()->create(['utilisateur_id' => $user2->id, 'score' => 50]);

        $stats = DiagnosticStress::statistiquesUtilisateur($user1->id);

        $this->assertEquals(1,   $stats['nombre_total']);
        $this->assertEquals(400, $stats['score_max']);
    }

    // ── Scopes ────────────────────────────────────────────────

    public function test_recents_scope_returns_diagnostics_within_last_30_days(): void
    {
        $user   = User::factory()->create();
        $recent = DiagnosticStress::factory()->create(['utilisateur_id' => $user->id, 'date' => now()->subDays(10)]);
        DiagnosticStress::factory()->create(['utilisateur_id' => $user->id, 'date' => now()->subDays(40)]);

        $results = DiagnosticStress::recents()->get();

        $this->assertCount(1, $results);
        $this->assertEquals($recent->id, $results->first()->id);
    }

    public function test_stress_eleve_scope_returns_diagnostics_with_score_above_300(): void
    {
        DiagnosticStress::factory()->create(['score' => 350]);
        DiagnosticStress::factory()->create(['score' => 200]);
        DiagnosticStress::factory()->create(['score' => 50]);

        $results = DiagnosticStress::stressEleve()->get();

        $this->assertCount(1, $results);
        $this->assertEquals(350, $results->first()->score);
    }

    public function test_stress_modere_scope_returns_diagnostics_between_150_and_300(): void
    {
        DiagnosticStress::factory()->create(['score' => 350]);
        DiagnosticStress::factory()->create(['score' => 200]);
        DiagnosticStress::factory()->create(['score' => 50]);

        $results = DiagnosticStress::stressModere()->get();

        $this->assertCount(1, $results);
        $this->assertEquals(200, $results->first()->score);
    }

    public function test_stress_faible_scope_returns_diagnostics_below_150(): void
    {
        DiagnosticStress::factory()->create(['score' => 350]);
        DiagnosticStress::factory()->create(['score' => 200]);
        DiagnosticStress::factory()->create(['score' => 50]);

        $results = DiagnosticStress::stressFaible()->get();

        $this->assertCount(1, $results);
        $this->assertEquals(50, $results->first()->score);
    }

    public function test_par_utilisateur_scope_filters_by_user(): void
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();
        DiagnosticStress::factory()->count(2)->create(['utilisateur_id' => $user1->id]);
        DiagnosticStress::factory()->count(3)->create(['utilisateur_id' => $user2->id]);

        $results = DiagnosticStress::parUtilisateur($user1->id)->get();

        $this->assertCount(2, $results);
    }

    // ── Relations ─────────────────────────────────────────────

    public function test_diagnostic_belongs_to_utilisateur(): void
    {
        $user       = User::factory()->create();
        $diagnostic = DiagnosticStress::factory()->create(['utilisateur_id' => $user->id]);

        $this->assertInstanceOf(User::class, $diagnostic->utilisateur);
        $this->assertEquals($user->id, $diagnostic->utilisateur->id);
    }

    public function test_diagnostic_has_many_evenements_via_pivot(): void
    {
        $diagnostic = DiagnosticStress::factory()->create();
        $events     = EvenementVie::factory()->count(2)->create();
        $diagnostic->evenements()->attach($events->pluck('id')->toArray(), ['date_selection' => now()]);

        $this->assertCount(2, $diagnostic->evenements);
    }
}
