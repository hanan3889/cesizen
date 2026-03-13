<?php

namespace Tests\Feature\Api;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\PageInformation;

class PageInformationTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_get_all_pages()
    {
        PageInformation::factory()->count(2)->create(['statut' => 'publie']);
        PageInformation::factory()->count(1)->create(['statut' => 'brouillon']);

        $response = $this->getJson('/api/v1/pages');

        $response->assertStatus(200)
            ->assertJsonCount(2, 'data')
            ->assertJsonStructure([
                'data' => [
                    '*' => [
                        'id',
                        'titre',
                        'description',
                        'statut',
                        'created_at',
                        'updated_at',
                    ]
                ]
            ]);
    }

    public function test_can_get_a_single_page()
    {
        $page = PageInformation::factory()->create(['statut' => 'publie']);

        $response = $this->getJson('/api/v1/pages/' . $page->id);

        $response->assertStatus(200)
            ->assertJson([
                'page' => [
                    'id' => $page->id,
                    'titre' => $page->titre,
                    'description' => $page->description,
                    'statut' => 'publie',
                ]
            ]);
    }

    public function test_admin_can_create_a_page()
    {
        $admin = \App\Models\User::factory()->admin()->create();
        $categorie = \App\Models\CategorieInformation::factory()->create();

        $pageData = [
            'titre' => 'New Page Title',
            'description' => 'New page content.',
            'categorie_information_id' => $categorie->id,
        ];

        $response = $this->actingAs($admin)->postJson('/api/v1/pages', $pageData);

        $response->assertStatus(201)
            ->assertJsonFragment(['titre' => 'New Page Title']);

        $this->assertDatabaseHas('page_informations', ['titre' => 'New Page Title']);
    }

    public function test_non_admin_cannot_create_a_page()
    {
        $user = \App\Models\User::factory()->create();
        $categorie = \App\Models\CategorieInformation::factory()->create();

        $pageData = [
            'titre' => 'New Page Title',
            'description' => 'New page content.',
            'categorie_information_id' => $categorie->id,
        ];

        $response = $this->actingAs($user)->postJson('/api/v1/pages', $pageData);

        $response->assertStatus(403);
    }

    public function test_admin_can_update_a_page()
    {
        $admin = \App\Models\User::factory()->admin()->create();
        $page = PageInformation::factory()->create();

        $updateData = ['titre' => 'Updated Title'];

        $response = $this->actingAs($admin)->putJson('/api/v1/pages/' . $page->id, $updateData);

        $response->assertStatus(200)
            ->assertJsonFragment(['titre' => 'Updated Title']);

        $this->assertDatabaseHas('page_informations', ['id' => $page->id, 'titre' => 'Updated Title']);
    }

    public function test_non_admin_cannot_update_a_page()
    {
        $user = \App\Models\User::factory()->create();
        $page = PageInformation::factory()->create();

        $updateData = ['titre' => 'Updated Title'];

        $response = $this->actingAs($user)->putJson('/api/v1/pages/' . $page->id, $updateData);

        $response->assertStatus(403);
    }

    public function test_admin_can_delete_a_page()
    {
        $admin = \App\Models\User::factory()->admin()->create();
        $page = PageInformation::factory()->create();

        $response = $this->actingAs($admin)->deleteJson('/api/v1/pages/' . $page->id);

        $response->assertStatus(200);

        $this->assertDatabaseMissing('page_informations', ['id' => $page->id]);
    }

    public function test_non_admin_cannot_delete_a_page()
    {
        $user = \App\Models\User::factory()->create();
        $page = PageInformation::factory()->create();

        $response = $this->actingAs($user)->deleteJson('/api/v1/pages/' . $page->id);

        $response->assertStatus(403);
    }

    // --- Admin vs non-admin visibility ---

    public function test_admin_sees_all_pages_including_non_published()
    {
        $admin = \App\Models\User::factory()->admin()->create();
        PageInformation::factory()->create(['statut' => 'publie']);
        PageInformation::factory()->create(['statut' => 'brouillon']);
        PageInformation::factory()->create(['statut' => 'archive']);

        $response = $this->actingAs($admin)->getJson('/api/v1/pages');

        $response->assertStatus(200);
        $this->assertCount(3, $response->json('data'));
    }

    public function test_non_admin_sees_only_published_pages()
    {
        $user = \App\Models\User::factory()->create();
        PageInformation::factory()->create(['statut' => 'publie']);
        PageInformation::factory()->create(['statut' => 'brouillon']);
        PageInformation::factory()->create(['statut' => 'archive']);

        $response = $this->actingAs($user)->getJson('/api/v1/pages');

        $response->assertStatus(200);
        $this->assertCount(1, $response->json('data'));
    }

    public function test_guest_sees_only_published_pages()
    {
        PageInformation::factory()->create(['statut' => 'publie']);
        PageInformation::factory()->create(['statut' => 'brouillon']);

        $response = $this->getJson('/api/v1/pages');

        $response->assertStatus(200);
        $this->assertCount(1, $response->json('data'));
    }

    public function test_admin_can_filter_pages_by_status()
    {
        $admin = \App\Models\User::factory()->admin()->create();
        PageInformation::factory()->count(2)->create(['statut' => 'brouillon']);
        PageInformation::factory()->create(['statut' => 'publie']);

        $response = $this->actingAs($admin)->getJson('/api/v1/pages?statut=brouillon');

        $response->assertStatus(200);
        $this->assertCount(2, $response->json('data'));
    }

    public function test_non_admin_cannot_view_non_published_page()
    {
        $user = \App\Models\User::factory()->create();
        $page = PageInformation::factory()->create(['statut' => 'brouillon']);

        $response = $this->actingAs($user)->getJson('/api/v1/pages/' . $page->id);

        $response->assertStatus(403);
    }

    public function test_admin_can_view_non_published_page()
    {
        $admin = \App\Models\User::factory()->admin()->create();
        $page  = PageInformation::factory()->create(['statut' => 'brouillon']);

        $response = $this->actingAs($admin)->getJson('/api/v1/pages/' . $page->id);

        $response->assertStatus(200)
                 ->assertJsonPath('page.id', $page->id);
    }

    // --- Publier / Archiver ---

    public function test_admin_can_publish_a_page()
    {
        $admin = \App\Models\User::factory()->admin()->create();
        $page  = PageInformation::factory()->create(['statut' => 'brouillon']);

        $response = $this->actingAs($admin)->postJson('/api/v1/pages/' . $page->id . '/publier');

        $response->assertStatus(200);
        $this->assertDatabaseHas('page_informations', ['id' => $page->id, 'statut' => 'publie']);
    }

    public function test_non_admin_cannot_publish_a_page()
    {
        $user = \App\Models\User::factory()->create();
        $page = PageInformation::factory()->create(['statut' => 'brouillon']);

        $response = $this->actingAs($user)->postJson('/api/v1/pages/' . $page->id . '/publier');

        $response->assertStatus(403);
    }

    public function test_admin_can_archive_a_page()
    {
        $admin = \App\Models\User::factory()->admin()->create();
        $page  = PageInformation::factory()->create(['statut' => 'publie']);

        $response = $this->actingAs($admin)->postJson('/api/v1/pages/' . $page->id . '/archiver');

        $response->assertStatus(200);
        $this->assertDatabaseHas('page_informations', ['id' => $page->id, 'statut' => 'archive']);
    }

    // --- Latest ---

    public function test_latest_returns_at_most_5_published_pages()
    {
        PageInformation::factory()->count(7)->create(['statut' => 'publie']);
        PageInformation::factory()->count(2)->create(['statut' => 'brouillon']);

        $response = $this->getJson('/api/v1/pages/latest');

        $response->assertStatus(200);
        $this->assertCount(5, $response->json());
    }

    public function test_latest_does_not_include_non_published_pages()
    {
        PageInformation::factory()->count(2)->create(['statut' => 'publie']);
        PageInformation::factory()->count(3)->create(['statut' => 'brouillon']);

        $response = $this->getJson('/api/v1/pages/latest');

        $response->assertStatus(200);
        $this->assertCount(2, $response->json());
    }

    // --- Show by slug ---

    public function test_can_get_a_published_page_by_slug()
    {
        $page = PageInformation::factory()->create(['statut' => 'publie', 'slug' => 'mon-article']);

        $response = $this->getJson('/api/v1/pages/slug/mon-article');

        $response->assertStatus(200)
                 ->assertJsonPath('id', $page->id);
    }

    public function test_guest_cannot_access_non_published_page_by_slug()
    {
        PageInformation::factory()->create(['statut' => 'brouillon', 'slug' => 'brouillon-article']);

        $response = $this->getJson('/api/v1/pages/slug/brouillon-article');

        $response->assertStatus(403);
    }

    public function test_admin_can_access_non_published_page_by_slug()
    {
        $admin = \App\Models\User::factory()->admin()->create();
        PageInformation::factory()->create(['statut' => 'brouillon', 'slug' => 'brouillon-admin']);

        $response = $this->actingAs($admin)->getJson('/api/v1/pages/slug/brouillon-admin');

        $response->assertStatus(200);
    }

    // --- 404 Tests ---

    public function test_returns_404_for_non_existent_page()
    {
        $this->getJson('/api/v1/pages/99999')->assertStatus(404);
    }

    public function test_admin_gets_404_when_updating_non_existent_page()
    {
        $admin = \App\Models\User::factory()->admin()->create();
        $this->actingAs($admin)->putJson('/api/v1/pages/99999', ['titre' => 'Ghost'])
             ->assertStatus(404);
    }

    public function test_admin_gets_404_when_deleting_non_existent_page()
    {
        $admin = \App\Models\User::factory()->admin()->create();
        $this->actingAs($admin)->deleteJson('/api/v1/pages/99999')->assertStatus(404);
    }

    public function test_returns_404_for_non_existent_slug()
    {
        $this->getJson('/api/v1/pages/slug/slug-inexistant')->assertStatus(404);
    }

    // --- 401 Guest Tests ---

    public function test_guest_cannot_create_a_page()
    {
        $categorie = \App\Models\CategorieInformation::factory()->create();
        $this->postJson('/api/v1/pages', [
            'titre'                     => 'Test',
            'description'               => 'Content',
            'categorie_information_id'  => $categorie->id,
        ])->assertStatus(401);
    }

    public function test_guest_cannot_update_a_page()
    {
        $page = PageInformation::factory()->create();
        $this->putJson('/api/v1/pages/' . $page->id, ['titre' => 'Hacked'])->assertStatus(401);
    }

    public function test_guest_cannot_delete_a_page()
    {
        $page = PageInformation::factory()->create();
        $this->deleteJson('/api/v1/pages/' . $page->id)->assertStatus(401);
    }

    // --- 422 Validation Tests ---

    public function test_create_page_fails_with_missing_fields()
    {
        $admin = \App\Models\User::factory()->admin()->create();
        $this->actingAs($admin)->postJson('/api/v1/pages', [])
             ->assertStatus(422)
             ->assertJsonValidationErrors(['titre', 'description', 'categorie_information_id']);
    }

    public function test_create_page_fails_with_invalid_categorie()
    {
        $admin = \App\Models\User::factory()->admin()->create();
        $this->actingAs($admin)->postJson('/api/v1/pages', [
            'titre'                    => 'Test',
            'description'              => 'Content',
            'categorie_information_id' => 99999,
        ])->assertStatus(422)->assertJsonValidationErrors('categorie_information_id');
    }

    // --- 403 Non-Admin Action Tests ---

    public function test_non_admin_cannot_archive_a_page()
    {
        $user = \App\Models\User::factory()->create();
        $page = PageInformation::factory()->create(['statut' => 'publie']);
        $this->actingAs($user)->postJson('/api/v1/pages/' . $page->id . '/archiver')
             ->assertStatus(403);
    }

    public function test_guest_cannot_publish_a_page()
    {
        $page = PageInformation::factory()->create(['statut' => 'brouillon']);
        $this->postJson('/api/v1/pages/' . $page->id . '/publier')->assertStatus(401);
    }

    public function test_guest_cannot_archive_a_page()
    {
        $page = PageInformation::factory()->create(['statut' => 'publie']);
        $this->postJson('/api/v1/pages/' . $page->id . '/archiver')->assertStatus(401);
    }
}