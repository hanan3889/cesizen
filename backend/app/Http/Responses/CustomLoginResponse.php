<?php

namespace App\Http\Responses;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;
use Symfony\Component\HttpFoundation\Response;

class CustomLoginResponse implements LoginResponseContract
{
    /**
     * Create an HTTP response that represents the object.
     *
     * @param  Request  $request
     * @return Response
     */
    public function toResponse($request): Response
    {
        $home = $request->user()->role === 'administrateur'
                    ? '/dashboard'
                    : '/';

        return $request->wantsJson()
                    ? new JsonResponse(['two_factor' => false])
                    : redirect()->intended($home);
    }
}
