import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../wayfinder'
/**
* @see \L5Swagger\Http\Controllers\SwaggerController::api
 * @see vendor/darkaonline/l5-swagger/src/Http/Controllers/SwaggerController.php:92
 * @route '/api/documentation'
 */
export const api = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: api.url(options),
    method: 'get',
})

api.definition = {
    methods: ["get","head"],
    url: '/api/documentation',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \L5Swagger\Http\Controllers\SwaggerController::api
 * @see vendor/darkaonline/l5-swagger/src/Http/Controllers/SwaggerController.php:92
 * @route '/api/documentation'
 */
api.url = (options?: RouteQueryOptions) => {
    return api.definition.url + queryParams(options)
}

/**
* @see \L5Swagger\Http\Controllers\SwaggerController::api
 * @see vendor/darkaonline/l5-swagger/src/Http/Controllers/SwaggerController.php:92
 * @route '/api/documentation'
 */
api.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: api.url(options),
    method: 'get',
})
/**
* @see \L5Swagger\Http\Controllers\SwaggerController::api
 * @see vendor/darkaonline/l5-swagger/src/Http/Controllers/SwaggerController.php:92
 * @route '/api/documentation'
 */
api.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: api.url(options),
    method: 'head',
})

/**
* @see \L5Swagger\Http\Controllers\SwaggerController::docs
 * @see vendor/darkaonline/l5-swagger/src/Http/Controllers/SwaggerController.php:34
 * @route '/docs'
 */
export const docs = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: docs.url(options),
    method: 'get',
})

docs.definition = {
    methods: ["get","head"],
    url: '/docs',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \L5Swagger\Http\Controllers\SwaggerController::docs
 * @see vendor/darkaonline/l5-swagger/src/Http/Controllers/SwaggerController.php:34
 * @route '/docs'
 */
docs.url = (options?: RouteQueryOptions) => {
    return docs.definition.url + queryParams(options)
}

/**
* @see \L5Swagger\Http\Controllers\SwaggerController::docs
 * @see vendor/darkaonline/l5-swagger/src/Http/Controllers/SwaggerController.php:34
 * @route '/docs'
 */
docs.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: docs.url(options),
    method: 'get',
})
/**
* @see \L5Swagger\Http\Controllers\SwaggerController::docs
 * @see vendor/darkaonline/l5-swagger/src/Http/Controllers/SwaggerController.php:34
 * @route '/docs'
 */
docs.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: docs.url(options),
    method: 'head',
})

/**
* @see \L5Swagger\Http\Controllers\SwaggerController::oauth2Callback
 * @see vendor/darkaonline/l5-swagger/src/Http/Controllers/SwaggerController.php:142
 * @route '/api/oauth2-callback'
 */
export const oauth2Callback = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: oauth2Callback.url(options),
    method: 'get',
})

oauth2Callback.definition = {
    methods: ["get","head"],
    url: '/api/oauth2-callback',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \L5Swagger\Http\Controllers\SwaggerController::oauth2Callback
 * @see vendor/darkaonline/l5-swagger/src/Http/Controllers/SwaggerController.php:142
 * @route '/api/oauth2-callback'
 */
oauth2Callback.url = (options?: RouteQueryOptions) => {
    return oauth2Callback.definition.url + queryParams(options)
}

/**
* @see \L5Swagger\Http\Controllers\SwaggerController::oauth2Callback
 * @see vendor/darkaonline/l5-swagger/src/Http/Controllers/SwaggerController.php:142
 * @route '/api/oauth2-callback'
 */
oauth2Callback.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: oauth2Callback.url(options),
    method: 'get',
})
/**
* @see \L5Swagger\Http\Controllers\SwaggerController::oauth2Callback
 * @see vendor/darkaonline/l5-swagger/src/Http/Controllers/SwaggerController.php:142
 * @route '/api/oauth2-callback'
 */
oauth2Callback.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: oauth2Callback.url(options),
    method: 'head',
})
const SwaggerController = { api, docs, oauth2Callback }

export default SwaggerController