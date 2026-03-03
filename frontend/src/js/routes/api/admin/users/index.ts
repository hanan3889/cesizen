import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\UserController::index
 * @see app/Http/Controllers/Api/V1/UserController.php:16
 * @route '/api/v1/admin/users'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/admin/users',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\UserController::index
 * @see app/Http/Controllers/Api/V1/UserController.php:16
 * @route '/api/v1/admin/users'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\UserController::index
 * @see app/Http/Controllers/Api/V1/UserController.php:16
 * @route '/api/v1/admin/users'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\UserController::index
 * @see app/Http/Controllers/Api/V1/UserController.php:16
 * @route '/api/v1/admin/users'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})
const users = {
    index: Object.assign(index, index),
}

export default users