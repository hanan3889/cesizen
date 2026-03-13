<?php

namespace Tests\Feature\Api\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AuthControllerTest extends TestCase
{
    use RefreshDatabase;

    // --- Register Tests ---

    public function test_user_can_register_successfully()
    {
        $userData = [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ];

        $response = $this->postJson('/api/v1/register', $userData);

        $response->assertStatus(201)
                 ->assertJsonStructure(['message', 'user', 'token']);
        $this->assertDatabaseHas('users', ['email' => 'test@example.com']);
    }

    public function test_register_fails_with_existing_email()
    {
        User::factory()->create(['email' => 'test@example.com']);
        $userData = [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ];

        $response = $this->postJson('/api/v1/register', $userData);
        $response->assertStatus(422);
    }

    // --- Login / Logout Tests ---

    public function test_user_can_login_with_correct_credentials()
    {
        $user = User::factory()->create(['password' => Hash::make('password123')]);
        $credentials = ['email' => $user->email, 'password' => 'password123'];

        $response = $this->postJson('/api/v1/login', $credentials);

        $response->assertStatus(200)
                 ->assertJsonStructure(['message', 'user', 'token']);
    }

    public function test_user_cannot_login_with_incorrect_credentials()
    {
        $user = User::factory()->create(['password' => Hash::make('password123')]);
        $credentials = ['email' => $user->email, 'password' => 'wrongpassword'];

        $response = $this->postJson('/api/v1/login', $credentials);
        $response->assertStatus(422);
    }

    public function test_user_can_logout()
    {
        $user = User::factory()->create();
        $token = $user->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders(['Authorization' => "Bearer $token"])
                         ->postJson('/api/v1/logout');
        
        $response->assertStatus(200);
        $this->assertDatabaseCount('personal_access_tokens', 0);
    }

    // --- Profile Tests ---

    public function test_user_can_retrieve_their_profile()
    {
        $user = User::factory()->create();
        $response = $this->actingAs($user)->getJson('/api/v1/me');
        $response->assertStatus(200)
                 ->assertJsonPath('user.id', $user->id);
    }

    public function test_user_can_update_their_profile()
    {
        $user = User::factory()->create();
        $updateData = ['name' => 'New Name'];

        $response = $this->actingAs($user)->putJson('/api/v1/profile', $updateData);

        $response->assertStatus(200)
                 ->assertJsonPath('user.name', 'New Name');
        $this->assertDatabaseHas('users', ['id' => $user->id, 'name' => 'New Name']);
    }

    // --- Password Change Tests ---

    public function test_user_can_change_their_password()
    {
        $user = User::factory()->create(['password' => Hash::make('current-password')]);
        $passwordData = [
            'current_password' => 'current-password',
            'password' => 'new-awesome-password',
            'password_confirmation' => 'new-awesome-password',
        ];

        $response = $this->actingAs($user)->putJson('/api/v1/password', $passwordData);

        $response->assertStatus(200);
        $user->refresh();
        $this->assertTrue(Hash::check('new-awesome-password', $user->password));
    }

    public function test_change_password_fails_with_incorrect_current_password()
    {
        $user = User::factory()->create(['password' => Hash::make('current-password')]);
        $passwordData = [
            'current_password' => 'wrong-current-password',
            'password' => 'new-awesome-password',
            'password_confirmation' => 'new-awesome-password',
        ];

        $response = $this->actingAs($user)->putJson('/api/v1/password', $passwordData);
        $response->assertStatus(422);
    }

    // --- 401 Unauthenticated Tests ---

    public function test_unauthenticated_user_cannot_access_profile()
    {
        $this->getJson('/api/v1/me')->assertStatus(401);
    }

    public function test_unauthenticated_user_cannot_update_profile()
    {
        $this->putJson('/api/v1/profile', ['name' => 'Hacker'])->assertStatus(401);
    }

    public function test_unauthenticated_user_cannot_delete_account()
    {
        $this->deleteJson('/api/v1/me', ['password' => 'password'])->assertStatus(401);
    }

    // --- Register Validation (400/422) ---

    public function test_register_fails_with_missing_fields()
    {
        $this->postJson('/api/v1/register', [])->assertStatus(422)
             ->assertJsonValidationErrors(['name', 'email', 'password']);
    }

    public function test_register_fails_with_short_password()
    {
        $response = $this->postJson('/api/v1/register', [
            'name'                  => 'Test',
            'email'                 => 'test@example.com',
            'password'              => '123',
            'password_confirmation' => '123',
        ]);
        $response->assertStatus(422)->assertJsonValidationErrors('password');
    }

    public function test_register_fails_with_password_mismatch()
    {
        $response = $this->postJson('/api/v1/register', [
            'name'                  => 'Test',
            'email'                 => 'test@example.com',
            'password'              => 'password123',
            'password_confirmation' => 'different123',
        ]);
        $response->assertStatus(422)->assertJsonValidationErrors('password');
    }

    // --- Login Validation (422) ---

    public function test_login_fails_with_missing_fields()
    {
        $this->postJson('/api/v1/login', [])->assertStatus(422)
             ->assertJsonValidationErrors(['email', 'password']);
    }

    // --- Deactivated Account ---

    public function test_deactivated_user_cannot_login()
    {
        $user = User::factory()->create([
            'password'  => Hash::make('password123'),
            'is_active' => false,
        ]);

        $response = $this->postJson('/api/v1/login', [
            'email'    => $user->email,
            'password' => 'password123',
        ]);

        $response->assertStatus(422);
    }

    // --- Delete Account ---

    public function test_user_can_delete_their_account()
    {
        $user = User::factory()->create(['password' => Hash::make('password123')]);

        $response = $this->actingAs($user)->deleteJson('/api/v1/me', [
            'password' => 'password123',
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseMissing('users', ['id' => $user->id]);
    }

    public function test_delete_account_fails_with_wrong_password()
    {
        $user = User::factory()->create(['password' => Hash::make('password123')]);

        $response = $this->actingAs($user)->deleteJson('/api/v1/me', [
            'password' => 'wrongpassword',
        ]);

        $response->assertStatus(422);
        $this->assertDatabaseHas('users', ['id' => $user->id]);
    }
}
