<?php

namespace Tests\Feature;

use App\Models\PageInformation;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia;
use Tests\TestCase;

class InformationPageTest extends TestCase
{
    use RefreshDatabase;

    public function test_information_page_is_displayed_correctly()
    {
        $user = User::factory()->create();
        PageInformation::factory()->count(3)->create();

        $response = $this->actingAs($user)->get('/informations');

        $response->assertOk();

        $response->assertInertia(function (AssertableInertia $page) {
            $page->component('Information/Index')
                ->has('pages', 3)
                ->has('pages.0.id')
                ->has('pages.0.titre')
                ->has('pages.0.description')
                ->has('pages.0.statut')
                ->has('pages.0.categorie');
        });
    }
}
