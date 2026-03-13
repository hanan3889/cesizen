<?php

namespace Tests\Unit;

use App\Models\DiagnosticStress;
use App\Models\EvenementVie;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EvenementVieTest extends TestCase
{
    use RefreshDatabase;

    // ── Accesseur : niveau_impact ─────────────────────────────

    public function test_niveau_impact_returns_eleve_when_points_above_50(): void
    {
        $evenement = EvenementVie::factory()->create(['points' => 51]);
        $this->assertEquals('Élevé', $evenement->niveau_impact);

        $evenement2 = EvenementVie::factory()->create(['points' => 100]);
        $this->assertEquals('Élevé', $evenement2->niveau_impact);
    }

    public function test_niveau_impact_returns_moyen_when_points_between_20_and_50(): void
    {
        $evenement = EvenementVie::factory()->create(['points' => 20]);
        $this->assertEquals('Moyen', $evenement->niveau_impact);

        $evenement2 = EvenementVie::factory()->create(['points' => 50]);
        $this->assertEquals('Moyen', $evenement2->niveau_impact);

        $evenement3 = EvenementVie::factory()->create(['points' => 35]);
        $this->assertEquals('Moyen', $evenement3->niveau_impact);
    }

    public function test_niveau_impact_returns_faible_when_points_below_20(): void
    {
        $evenement = EvenementVie::factory()->create(['points' => 19]);
        $this->assertEquals('Faible', $evenement->niveau_impact);

        $evenement2 = EvenementVie::factory()->create(['points' => 0]);
        $this->assertEquals('Faible', $evenement2->niveau_impact);
    }

    // ── Scopes ────────────────────────────────────────────────

    public function test_par_points_desc_scope_orders_by_points_descending(): void
    {
        EvenementVie::factory()->create(['points' => 30]);
        EvenementVie::factory()->create(['points' => 80]);
        EvenementVie::factory()->create(['points' => 10]);

        $results = EvenementVie::parPointsDesc()->get();

        $this->assertEquals(80, $results->first()->points);
        $this->assertEquals(10, $results->last()->points);
    }

    public function test_par_points_asc_scope_orders_by_points_ascending(): void
    {
        EvenementVie::factory()->create(['points' => 30]);
        EvenementVie::factory()->create(['points' => 80]);
        EvenementVie::factory()->create(['points' => 10]);

        $results = EvenementVie::parPointsAsc()->get();

        $this->assertEquals(10, $results->first()->points);
        $this->assertEquals(80, $results->last()->points);
    }

    public function test_impact_eleve_scope_returns_events_above_50_points(): void
    {
        EvenementVie::factory()->create(['points' => 51]);
        EvenementVie::factory()->create(['points' => 100]);
        EvenementVie::factory()->create(['points' => 50]);
        EvenementVie::factory()->create(['points' => 20]);

        $results = EvenementVie::impactElevé()->get();

        $this->assertCount(2, $results);
        $results->each(fn ($e) => $this->assertGreaterThan(50, $e->points));
    }

    public function test_impact_moyen_scope_returns_events_between_20_and_50_points(): void
    {
        EvenementVie::factory()->create(['points' => 60]);
        EvenementVie::factory()->create(['points' => 20]);
        EvenementVie::factory()->create(['points' => 50]);
        EvenementVie::factory()->create(['points' => 19]);

        $results = EvenementVie::impactMoyen()->get();

        $this->assertCount(2, $results);
        $results->each(function ($e) {
            $this->assertGreaterThanOrEqual(20, $e->points);
            $this->assertLessThanOrEqual(50, $e->points);
        });
    }

    public function test_impact_faible_scope_returns_events_below_20_points(): void
    {
        EvenementVie::factory()->create(['points' => 60]);
        EvenementVie::factory()->create(['points' => 20]);
        EvenementVie::factory()->create(['points' => 10]);
        EvenementVie::factory()->create(['points' => 5]);

        $results = EvenementVie::impactFaible()->get();

        $this->assertCount(2, $results);
        $results->each(fn ($e) => $this->assertLessThan(20, $e->points));
    }

    // ── Méthodes statiques ────────────────────────────────────

    public function test_tous_par_points_returns_all_events_ordered_by_points_desc(): void
    {
        EvenementVie::factory()->create(['points' => 40]);
        EvenementVie::factory()->create(['points' => 90]);
        EvenementVie::factory()->create(['points' => 15]);

        $results = EvenementVie::tousParPoints();

        $this->assertCount(3, $results);
        $this->assertEquals(90, $results->first()->points);
        $this->assertEquals(15, $results->last()->points);
    }

    public function test_evenements_holmes_rahe_returns_all_events(): void
    {
        EvenementVie::factory()->count(5)->create();

        $results = EvenementVie::evenementsHolmesRahe();

        $this->assertCount(5, $results);
    }

    // ── Relations ─────────────────────────────────────────────

    public function test_evenement_belongs_to_many_diagnostics(): void
    {
        $evenement   = EvenementVie::factory()->create();
        $diagnostic1 = DiagnosticStress::factory()->create();
        $diagnostic2 = DiagnosticStress::factory()->create();

        $diagnostic1->evenements()->attach($evenement->id, ['date_selection' => now()]);
        $diagnostic2->evenements()->attach($evenement->id, ['date_selection' => now()]);

        $this->assertCount(2, $evenement->fresh()->diagnostics);
    }

    public function test_evenement_with_no_diagnostics_has_empty_relation(): void
    {
        $evenement = EvenementVie::factory()->create();

        $this->assertCount(0, $evenement->diagnostics);
    }

    public function test_pivot_contains_date_selection(): void
    {
        $evenement  = EvenementVie::factory()->create();
        $diagnostic = DiagnosticStress::factory()->create();
        $date       = now()->toDateTimeString();

        $diagnostic->evenements()->attach($evenement->id, ['date_selection' => $date]);

        $pivot = $evenement->fresh()->diagnostics->first()->pivot;
        $this->assertNotNull($pivot->date_selection);
    }
}
