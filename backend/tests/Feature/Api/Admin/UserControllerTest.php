<?php

namespace Tests\Feature\Api\Admin;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserControllerTest extends TestCase
{
    use RefreshDatabase;

    private $user;
    private $admin;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
        $this->admin = User::factory()->admin()->create();
    }

    public function test_guest_cannot_access_admin_users_index()
    {
        $response = $this->getJson('/api/v1/admin/users');
        $response->assertStatus(401);
    }

    public function test_non_admin_user_cannot_access_admin_users_index()
    {
        $response = $this->actingAs($this->user)->getJson('/api/v1/admin/users');
        $response->assertStatus(403);
    }

    public function test_admin_can_access_admin_users_index()
    {
        $response = $this->actingAs($this->admin)->getJson('/api/v1/admin/users');
        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'data' => [
                         '*' => ['id', 'name', 'email', 'role', 'created_at']
                     ]
                 ]);
    }
}
