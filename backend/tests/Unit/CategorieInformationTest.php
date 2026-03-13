<?php

namespace Tests\Unit;

use App\Models\CategorieInformation;
use App\Models\PageInformation;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CategorieInformationTest extends TestCase
{
    use RefreshDatabase;

    // ── Accesseurs ────────────────────────────────────────────

    public function test_nombre_pages_returns_total_page_count(): void
    {
        $categorie = CategorieInformation::factory()->create();
        PageInformation::factory()->count(3)->create(['categorie_information_id' => $categorie->id]);

        $this->assertEquals(3, $categorie->nombre_pages);
    }

    public function test_nombre_pages_returns_zero_when_no_pages(): void
    {
        $categorie = CategorieInformation::factory()->create();

        $this->assertEquals(0, $categorie->nombre_pages);
    }

    public function test_nombre_pages_publiees_returns_only_published_count(): void
    {
        $categorie = CategorieInformation::factory()->create();
        PageInformation::factory()->count(2)->create([
            'categorie_information_id' => $categorie->id,
            'statut'                   => 'publie',
        ]);
        PageInformation::factory()->create([
            'categorie_information_id' => $categorie->id,
            'statut'                   => 'brouillon',
        ]);
        PageInformation::factory()->create([
            'categorie_information_id' => $categorie->id,
            'statut'                   => 'archive',
        ]);

        $this->assertEquals(2, $categorie->nombre_pages_publiees);
    }

    public function test_nombre_pages_publiees_returns_zero_when_no_published_pages(): void
    {
        $categorie = CategorieInformation::factory()->create();
        PageInformation::factory()->create([
            'categorie_information_id' => $categorie->id,
            'statut'                   => 'brouillon',
        ]);

        $this->assertEquals(0, $categorie->nombre_pages_publiees);
    }

    // ── Relations ─────────────────────────────────────────────

    public function test_categorie_has_many_pages(): void
    {
        $categorie = CategorieInformation::factory()->create();
        PageInformation::factory()->count(4)->create(['categorie_information_id' => $categorie->id]);

        $this->assertCount(4, $categorie->pages);
    }

    public function test_categorie_pages_relation_is_empty_when_no_pages(): void
    {
        $categorie = CategorieInformation::factory()->create();

        $this->assertCount(0, $categorie->pages);
    }

    public function test_pages_publiees_relation_returns_only_published(): void
    {
        $categorie = CategorieInformation::factory()->create();
        PageInformation::factory()->count(2)->create([
            'categorie_information_id' => $categorie->id,
            'statut'                   => 'publie',
        ]);
        PageInformation::factory()->create([
            'categorie_information_id' => $categorie->id,
            'statut'                   => 'brouillon',
        ]);

        $this->assertCount(2, $categorie->pagesPubliees);
        $categorie->pagesPubliees->each(fn ($p) => $this->assertEquals('publie', $p->statut));
    }

    public function test_pages_are_isolated_per_categorie(): void
    {
        $cat1 = CategorieInformation::factory()->create();
        $cat2 = CategorieInformation::factory()->create();

        PageInformation::factory()->count(3)->create(['categorie_information_id' => $cat1->id]);
        PageInformation::factory()->count(2)->create(['categorie_information_id' => $cat2->id]);

        $this->assertCount(3, $cat1->pages);
        $this->assertCount(2, $cat2->pages);
    }

    public function test_page_belongs_to_categorie(): void
    {
        $categorie = CategorieInformation::factory()->create();
        $page      = PageInformation::factory()->create(['categorie_information_id' => $categorie->id]);

        $this->assertInstanceOf(CategorieInformation::class, $page->categorie);
        $this->assertEquals($categorie->id, $page->categorie->id);
    }
}
