<?php

namespace Tests\Feature\Api;

use App\Models\CategorieInformation;
use App\Models\PageInformation;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PageInformationTest extends TestCase
{
    use RefreshDatabase;

    private $admin;
    private $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->admin = User::factory()->admin()->create();
        $this->user = User::factory()->create();
    }

    // --- Index Tests ---

    public function test_it_returns_only_published_pages_for_guests()
    {
        PageInformation::factory()->create(['statut' => 'publie']);
        PageInformation::factory()->create(['statut' => 'brouillon']);
        PageInformation::factory()->create(['statut' => 'archive']);

        $response = $this->getJson('/api/v1/pages');

        $response->assertStatus(200)
                 ->assertJsonCount(1, 'data')
                 ->assertJsonPath('data.0.statut', 'publie');
    }

    public function test_admin_can_filter_pages_by_status()
    {
        PageInformation::factory()->create(['statut' => 'publie']);
        PageInformation::factory()->create(['statut' => 'brouillon']);

        $response = $this->actingAs($this->admin)->getJson('/api/v1/pages?statut=brouillon');

        $response->assertStatus(200)
                 ->assertJsonCount(1, 'data')
                 ->assertJsonPath('data.0.statut', 'brouillon');
    }

    // --- Show Tests ---

    public function test_guest_can_see_a_published_page()
    {
        $page = PageInformation::factory()->create(['statut' => 'publie']);
        $response = $this->getJson("/api/v1/pages/{$page->id}");
        $response->assertStatus(200)
                 ->assertJsonPath('page.id', $page->id);
    }

    public function test_guest_cannot_see_a_draft_page()
    {
        $page = PageInformation::factory()->create(['statut' => 'brouillon']);
        $response = $this->getJson("/api/v1/pages/{$page->id}");
        $response->assertStatus(403);
    }

    public function test_admin_can_see_a_draft_page()
    {
        $page = PageInformation::factory()->create(['statut' => 'brouillon']);
        $response = $this->actingAs($this->admin)->getJson("/api/v1/pages/{$page->id}");
        $response->assertStatus(200)
                 ->assertJsonPath('page.id', $page->id);
    }

    // --- Store Tests ---

    public function test_admin_can_create_a_page()
    {
        $category = CategorieInformation::factory()->create();
        $pageData = [
            'titre' => 'New Page Title',
            'description' => 'Page description.',
            'categorie_information_id' => $category->id,
        ];

        $response = $this->actingAs($this->admin)->postJson('/api/v1/pages', $pageData);

        $response->assertStatus(201)
                 ->assertJsonPath('page.titre', 'New Page Title');
        $this->assertDatabaseHas('page_informations', ['titre' => 'New Page Title']);
    }

    public function test_non_admin_cannot_create_a_page()
    {
        $category = CategorieInformation::factory()->create();
        $pageData = [
            'titre' => 'New Page Title',
            'description' => 'Page description.',
            'categorie_information_id' => $category->id,
        ];

        $response = $this->actingAs($this->user)->postJson('/api/v1/pages', $pageData);
        $response->assertStatus(403);
    }

    // --- Update Tests ---

    public function test_admin_can_update_a_page()
    {
        $page = PageInformation::factory()->create();
        $updateData = ['titre' => 'Updated Title'];

        $response = $this->actingAs($this->admin)->putJson("/api/v1/pages/{$page->id}", $updateData);

        $response->assertStatus(200)
                 ->assertJsonPath('page.titre', 'Updated Title');
        $this->assertDatabaseHas('page_informations', ['id' => $page->id, 'titre' => 'Updated Title']);
    }

    // --- Destroy Tests ---

    public function test_admin_can_delete_a_page()
    {
        $page = PageInformation::factory()->create();
        $response = $this->actingAs($this->admin)->deleteJson("/api/v1/pages/{$page->id}");
        $response->assertStatus(200);
        $this->assertDatabaseMissing('page_informations', ['id' => $page->id]);
    }

    // --- Custom Action Tests ---

    public function test_admin_can_publish_a_page()
    {
        $page = PageInformation::factory()->create(['statut' => 'brouillon']);
        $response = $this->actingAs($this->admin)->postJson("/api/v1/pages/{$page->id}/publier");

        $response->assertStatus(200)
                 ->assertJsonPath('page.statut', 'publie');
        $this->assertDatabaseHas('page_informations', ['id' => $page->id, 'statut' => 'publie']);
    }

    public function test_admin_can_archive_a_page()
    {
        $page = PageInformation::factory()->create(['statut' => 'publie']);
        $response = $this->actingAs($this->admin)->postJson("/api/v1/pages/{$page->id}/archiver");

        $response->assertStatus(200)
                 ->assertJsonPath('page.statut', 'archive');
        $this->assertDatabaseHas('page_informations', ['id' => $page->id, 'statut' => 'archive']);
    }

    public function test_non_admin_cannot_publish_a_page()
    {
        $page = PageInformation::factory()->create(['statut' => 'brouillon']);
        $response = $this->actingAs($this->user)->postJson("/api/v1/pages/{$page->id}/publier");
        $response->assertStatus(403);
    }
}
