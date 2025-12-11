<?php

namespace App\Http\Controllers\Api;


use App\Http\Controllers\Controller;

/**
 * @OA\SecurityScheme(
 *     securityScheme="bearerAuth",
 *     type="http",
 *     scheme="bearer",
 *     bearerFormat="JWT"
 * )
 *
 * @OA\Tag(
 *     name="Authentification",
 *     description="Endpoints pour l'authentification des utilisateurs"
 * )
 *
 * @OA\Tag(
 *     name="Diagnostics",
 *     description="Gestion des diagnostics de stress"
 * )
 *
 * @OA\Tag(
 *     name="Événements",
 *     description="Événements de vie Holmes-Rahe"
 * )
 *
 * @OA\Tag(
 *     name="Pages",
 *     description="Pages d'information sur la santé mentale"
 * )
 *
 * @OA\Tag(
 *     name="Catégories",
 *     description="Catégories de pages d'information"
 * )
 *
 * @OA\Tag(
 *     name="Utilisateurs",
 *     description="Gestion des utilisateurs (Admin)"
 * )
 */
class ApiController extends Controller
{
    //
}
