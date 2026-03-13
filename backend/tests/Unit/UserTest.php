<?php

namespace Tests\Unit;

use App\Models\DiagnosticStress;
use App\Models\PageInformation;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserTest extends TestCase
{
    use RefreshDatabase;

    // ── isAdmin / isUser ───────────────────────────────────────

    public function test_is_admin_returns_true_for_administrator_role(): void
    {
        $admin = User::factory()->admin()->create();

        $this->assertTrue($admin->isAdmin());
    }

    public function test_is_admin_returns_false_for_utilisateur_role(): void
    {
        $user = User::factory()->create(['role' => 'utilisateur']);

        $this->assertFalse($user->isAdmin());
    }

    public function test_is_user_returns_true_for_utilisateur_role(): void
    {
        $user = User::factory()->create(['role' => 'utilisateur']);

        $this->assertTrue($user->isUser());
    }

    public function test_is_user_returns_false_for_administrator_role(): void
    {
        $admin = User::factory()->admin()->create();

        $this->assertFalse($admin->isUser());
    }

    // ── Scopes ────────────────────────────────────────────────

    public function test_administrateurs_scope_returns_only_admins(): void
    {
        User::factory()->admin()->count(2)->create();
        User::factory()->create(['role' => 'utilisateur']);

        $admins = User::administrateurs()->get();

        $this->assertCount(2, $admins);
        $admins->each(fn ($u) => $this->assertEquals('administrateur', $u->role));
    }

    public function test_utilisateurs_scope_returns_only_regular_users(): void
    {
        User::factory()->create(['role' => 'utilisateur']);
        User::factory()->create(['role' => 'utilisateur']);
        User::factory()->admin()->create();

        $users = User::utilisateurs()->get();

        $this->assertCount(2, $users);
        $users->each(fn ($u) => $this->assertEquals('utilisateur', $u->role));
    }

    // ── Relations ─────────────────────────────────────────────

    public function test_user_has_many_diagnostics(): void
    {
        $user = User::factory()->create();
        DiagnosticStress::factory()->count(3)->create(['utilisateur_id' => $user->id]);

        $this->assertCount(3, $user->diagnostics);
    }

    public function test_user_has_many_pages_gerees(): void
    {
        $admin = User::factory()->admin()->create();
        PageInformation::factory()->count(2)->create(['administrateur_id' => $admin->id]);

        $this->assertCount(2, $admin->pagesGerees);
    }

    public function test_user_diagnostics_belong_to_that_user(): void
    {
        $user  = User::factory()->create();
        $other = User::factory()->create();
        DiagnosticStress::factory()->create(['utilisateur_id' => $user->id]);
        DiagnosticStress::factory()->create(['utilisateur_id' => $other->id]);

        $this->assertCount(1, $user->diagnostics);
        $this->assertEquals($user->id, $user->diagnostics->first()->utilisateur_id);
    }
}
