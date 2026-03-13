<?php

namespace Tests\Feature\Auth;

use Tests\TestCase;

class PasswordResetTest extends TestCase
{
    public function test_password_reset_is_handled_by_api()
    {
        $this->markTestSkipped('Password reset is handled by the API — see tests/Feature/Api/Auth/AuthControllerTest.php');
    }
}
