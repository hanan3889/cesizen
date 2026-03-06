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
}