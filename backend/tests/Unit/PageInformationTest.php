<?php

namespace Tests\Unit;

use App\Models\CategorieInformation;
use App\Models\PageInformation;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PageInformationTest extends TestCase
{
    use RefreshDatabase;

    // ── Génération du slug ────────────────────────────────────

    public function test_slug_is_auto_generated_from_titre_on_creation(): void
    {
        $page = PageInformation::factory()->create(['titre' => 'Mon Article Test', 'slug' => null]);

        // The factory sets the slug explicitly; test the model boot behavior via create without slug
        $page2 = PageInformation::create([
            'titre'                    => 'Gestion du Stress au Travail',
            'description'              => 'Contenu de test',
            'statut'                   => 'brouillon',
            'categorie_information_id' => CategorieInformation::factory()->create()->id,
            'administrateur_id'        => User::factory()->admin()->create()->id,
        ]);

        $this->assertEquals('gestion-du-stress-au-travail', $page2->slug);
    }

    public function test_custom_slug_is_preserved_when_provided(): void
    {
        $page = PageInformation::create([
            'titre'                    => 'Mon Titre',
            'slug'                     => 'mon-slug-personnalise',
            'description'              => 'Contenu',
            'statut'                   => 'brouillon',
            'categorie_information_id' => CategorieInformation::factory()->create()->id,
            'administrateur_id'        => User::factory()->admin()->create()->id,
        ]);

        $this->assertEquals('mon-slug-personnalise', $page->slug);
    }

    // ── Méthodes utilitaires ──────────────────────────────────

    public function test_publier_sets_statut_to_publie(): void
    {
        $page = PageInformation::factory()->create(['statut' => 'brouillon']);

        $page->publier();

        $this->assertEquals('publie', $page->fresh()->statut);
    }

    public function test_archiver_sets_statut_to_archive(): void
    {
        $page = PageInformation::factory()->create(['statut' => 'publie']);

        $page->archiver();

        $this->assertEquals('archive', $page->fresh()->statut);
    }

    public function test_mettre_en_brouillon_sets_statut_to_brouillon(): void
    {
        $page = PageInformation::factory()->create(['statut' => 'publie']);

        $page->mettreEnBrouillon();

        $this->assertEquals('brouillon', $page->fresh()->statut);
    }

    public function test_est_publiee_returns_true_when_published(): void
    {
        $page = PageInformation::factory()->create(['statut' => 'publie']);

        $this->assertTrue($page->estPubliee());
    }

    public function test_est_publiee_returns_false_when_brouillon(): void
    {
        $page = PageInformation::factory()->create(['statut' => 'brouillon']);

        $this->assertFalse($page->estPubliee());
    }

    public function test_est_publiee_returns_false_when_archive(): void
    {
        $page = PageInformation::factory()->create(['statut' => 'archive']);

        $this->assertFalse($page->estPubliee());
    }

    // ── Scopes ────────────────────────────────────────────────

    public function test_publiees_scope_returns_only_published_pages(): void
    {
        PageInformation::factory()->create(['statut' => 'publie']);
        PageInformation::factory()->create(['statut' => 'brouillon']);
        PageInformation::factory()->create(['statut' => 'archive']);

        $publiees = PageInformation::publiees()->get();

        $this->assertCount(1, $publiees);
        $this->assertEquals('publie', $publiees->first()->statut);
    }

    public function test_brouillons_scope_returns_only_drafts(): void
    {
        PageInformation::factory()->create(['statut' => 'publie']);
        PageInformation::factory()->count(2)->create(['statut' => 'brouillon']);

        $brouillons = PageInformation::brouillons()->get();

        $this->assertCount(2, $brouillons);
        $brouillons->each(fn ($p) => $this->assertEquals('brouillon', $p->statut));
    }

    public function test_archivees_scope_returns_only_archived_pages(): void
    {
        PageInformation::factory()->create(['statut' => 'publie']);
        PageInformation::factory()->create(['statut' => 'archive']);

        $archivees = PageInformation::archivees()->get();

        $this->assertCount(1, $archivees);
        $this->assertEquals('archive', $archivees->first()->statut);
    }

    public function test_par_categorie_scope_filters_by_category(): void
    {
        $cat1 = CategorieInformation::factory()->create();
        $cat2 = CategorieInformation::factory()->create();
        PageInformation::factory()->count(3)->create(['categorie_information_id' => $cat1->id]);
        PageInformation::factory()->count(2)->create(['categorie_information_id' => $cat2->id]);

        $pages = PageInformation::parCategorie($cat1->id)->get();

        $this->assertCount(3, $pages);
        $pages->each(fn ($p) => $this->assertEquals($cat1->id, $p->categorie_information_id));
    }

    // ── Relations ─────────────────────────────────────────────

    public function test_page_belongs_to_categorie(): void
    {
        $categorie = CategorieInformation::factory()->create();
        $page      = PageInformation::factory()->create(['categorie_information_id' => $categorie->id]);

        $this->assertInstanceOf(CategorieInformation::class, $page->categorie);
        $this->assertEquals($categorie->id, $page->categorie->id);
    }

    public function test_page_belongs_to_administrateur(): void
    {
        $admin = User::factory()->admin()->create();
        $page  = PageInformation::factory()->create(['administrateur_id' => $admin->id]);

        $this->assertInstanceOf(User::class, $page->administrateur);
        $this->assertEquals($admin->id, $page->administrateur->id);
    }
}
