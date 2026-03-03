<?php

namespace Tests\Feature\Api;

use App\Models\CategorieInformation;
use App\Models\PageInformation;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CategorieInformationTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test if the API returns a list of categories.
     *
     * @return void
     */
    public function test_it_returns_a_list_of_categories()
    {
        // Arrange: Create 3 categories using the factory
        CategorieInformation::factory()->count(3)->create();

        // Act: Make a GET request to the categories index endpoint
        $response = $this->getJson('/api/v1/categories');

        // Assert: Check if the response is successful and structured correctly
        $response->assertStatus(200)
                 ->assertJsonCount(3, 'categories')
                 ->assertJsonStructure([
                     'categories' => [
                         '*' => [
                             'id',
                             'categorie',
                         ]
                     ]
                 ]);
    }

    /**
     * Test if the API returns a single category.
     *
     * @return void
     */
    public function test_it_returns_a_single_category()
    {
        // Arrange: Create a single category
        $category = CategorieInformation::factory()->create();

        // Act: Make a GET request to the category show endpoint
        $response = $this->getJson('/api/v1/categories/' . $category->id);

        // Assert: Check if the response is successful and contains the correct data
        $response->assertStatus(200)
                 ->assertJson([
                     'categorie' => [
                         'id' => $category->id,
                         'categorie' => $category->categorie,
                     ]
                 ]);
    }

    /**
     * Test if the API returns 404 for a non-existent category.
     *
     * @return void
     */
    public function test_it_returns_404_for_non_existent_category()
    {
        // Act: Make a GET request to a non-existent category
        $response = $this->getJson('/api/v1/categories/999');

        // Assert: Check if the response is a 404 Not Found
        $response->assertStatus(404);
    }

    // --- Store Tests ---

    public function test_guests_cannot_create_category()
    {
        $response = $this->postJson('/api/v1/categories', ['categorie' => 'New Category']);
        $response->assertStatus(401); // Unauthorized
    }

    public function test_non_admin_users_cannot_create_category()
    {
        $user = User::factory()->create(['role' => 'utilisateur']);
        $response = $this->actingAs($user)->postJson('/api/v1/categories', ['categorie' => 'New Category']);
        $response->assertStatus(403); // Forbidden
    }

    public function test_admin_can_create_category()
    {
        $admin = User::factory()->admin()->create();
        $categoryName = 'A Brand New Category';

        $response = $this->actingAs($admin)->postJson('/api/v1/categories', ['categorie' => $categoryName]);

        $response->assertStatus(201)
                 ->assertJson([
                     'message' => 'Catégorie créée avec succès',
                     'categorie' => [
                         'categorie' => $categoryName,
                     ]
                 ]);

        $this->assertDatabaseHas('categorie_informations', ['categorie' => $categoryName]);
    }

    public function test_create_category_fails_with_invalid_data()
    {
        $admin = User::factory()->admin()->create();
        $response = $this->actingAs($admin)->postJson('/api/v1/categories', ['categorie' => '']);
        $response->assertStatus(422); // Unprocessable Entity
    }

    // --- Destroy Tests ---

    public function test_guests_cannot_delete_category()
    {
        $category = CategorieInformation::factory()->create();
        $response = $this->deleteJson("/api/v1/categories/{$category->id}");
        $response->assertStatus(401);
    }

    public function test_non_admin_users_cannot_delete_category()
    {
        $user = User::factory()->create(['role' => 'utilisateur']);
        $category = CategorieInformation::factory()->create();
        $response = $this->actingAs($user)->deleteJson("/api/v1/categories/{$category->id}");
        $response->assertStatus(403);
    }

    public function test_admin_can_delete_category()
    {
        $admin = User::factory()->admin()->create();
        $category = CategorieInformation::factory()->create();

        $response = $this->actingAs($admin)->deleteJson("/api/v1/categories/{$category->id}");

        $response->assertStatus(200)
                 ->assertJson(['message' => 'Catégorie supprimée avec succès']);

        $this->assertDatabaseMissing('categorie_informations', ['id' => $category->id]);
    }

    public function test_cannot_delete_category_with_associated_pages()
    {
        $admin = User::factory()->admin()->create();
        $category = CategorieInformation::factory()->create();
        // We need a PageInformation model and factory for this to work.
        // Assuming PageInformation model exists, but we might need to create a factory.
        // For now, let's simulate this by attaching a page.
        // A proper implementation would require PageInformationFactory.
        PageInformation::factory()->create(['categorie_information_id' => $category->id]);


        $response = $this->actingAs($admin)->deleteJson("/api/v1/categories/{$category->id}");

        $response->assertStatus(422)
                 ->assertJson(['message' => 'Impossible de supprimer cette catégorie car elle contient des pages']);

        $this->assertDatabaseHas('categorie_informations', ['id' => $category->id]);
    }
}
