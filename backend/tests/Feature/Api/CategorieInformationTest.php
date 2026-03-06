<?php

namespace Tests\Feature\Api;

use App\Models\CategorieInformation;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CategorieInformationTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_get_all_categories()
    {
        CategorieInformation::factory()->count(3)->create();

        $response = $this->getJson('/api/v1/categories');

        $response->assertStatus(200)
            ->assertJsonCount(3, 'categories')
            ->assertJsonStructure([
                'categories' => [
                    '*' => [
                        'id',
                        'categorie',
                        'nombre_pages',
                        'created_at',
                    ]
                ]
            ]);
    }

    public function test_can_get_a_single_category()
    {
        $category = CategorieInformation::factory()->create();

        $response = $this->getJson('/api/v1/categories/' . $category->id);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'categorie' => [
                    'id',
                    'categorie',
                    'nombre_pages',
                    'nombre_pages_publiees',
                    'pages',
                ]
            ])
            ->assertJsonPath('categorie.id', $category->id);
    }

    public function test_admin_can_create_a_category()
    {
        $admin = \App\Models\User::factory()->admin()->create();
        $categoryData = ['categorie' => 'New Category'];

        $response = $this->actingAs($admin)->postJson('/api/v1/categories', $categoryData);

        $response->assertStatus(201)
            ->assertJsonFragment(['categorie' => 'New Category']);

        $this->assertDatabaseHas('categorie_informations', ['categorie' => 'New Category']);
    }

    public function test_non_admin_cannot_create_a_category()
    {
        $user = \App\Models\User::factory()->create();
        $categoryData = ['categorie' => 'New Category'];

        $response = $this->actingAs($user)->postJson('/api/v1/categories', $categoryData);

        $response->assertStatus(403);
    }

    public function test_create_category_requires_a_name()
    {
        $admin = \App\Models\User::factory()->admin()->create();

        $response = $this->actingAs($admin)->postJson('/api/v1/categories', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors('categorie');
    }

    public function test_admin_can_update_a_category()
    {
        $admin = \App\Models\User::factory()->admin()->create();
        $category = CategorieInformation::factory()->create();
        $updateData = ['categorie' => 'Updated Category'];

        $response = $this->actingAs($admin)->putJson('/api/v1/categories/' . $category->id, $updateData);

        $response->assertStatus(200)
            ->assertJsonFragment(['categorie' => 'Updated Category']);

        $this->assertDatabaseHas('categorie_informations', ['id' => $category->id, 'categorie' => 'Updated Category']);
    }

    public function test_non_admin_cannot_update_a_category()
    {
        $user = \App\Models\User::factory()->create();
        $category = CategorieInformation::factory()->create();
        $updateData = ['categorie' => 'Updated Category'];

        $response = $this->actingAs($user)->putJson('/api/v1/categories/' . $category->id, $updateData);

        $response->assertStatus(403);
    }

    public function test_admin_can_delete_a_category()
    {
        $admin = \App\Models\User::factory()->admin()->create();
        $category = CategorieInformation::factory()->create();

        $response = $this->actingAs($admin)->deleteJson('/api/v1/categories/' . $category->id);

        $response->assertStatus(200);
        $this->assertDatabaseMissing('categorie_informations', ['id' => $category->id]);
    }

    public function test_non_admin_cannot_delete_a_category()
    {
        $user = \App\Models\User::factory()->create();
        $category = CategorieInformation::factory()->create();

        $response = $this->actingAs($user)->deleteJson('/api/v1/categories/' . $category->id);

        $response->assertStatus(403);
    }

    public function test_admin_cannot_delete_a_category_with_pages()
    {
        $admin = \App\Models\User::factory()->admin()->create();
        $category = CategorieInformation::factory()
            ->has(\App\Models\PageInformation::factory()->count(1), 'pages')
            ->create();

        $response = $this->actingAs($admin)->deleteJson('/api/v1/categories/' . $category->id);

        $response->assertStatus(422);
        $this->assertDatabaseHas('categorie_informations', ['id' => $category->id]);
    }
}