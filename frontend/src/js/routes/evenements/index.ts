import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\Api\EvenementVieController::index
 * @see app/Http/Controllers/Api/EvenementVieController.php:39
 * @route '/api/v1/evenements'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/evenements',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\EvenementVieController::index
 * @see app/Http/Controllers/Api/EvenementVieController.php:39
 * @route '/api/v1/evenements'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\EvenementVieController::index
 * @see app/Http/Controllers/Api/EvenementVieController.php:39
 * @route '/api/v1/evenements'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\EvenementVieController::index
 * @see app/Http/Controllers/Api/EvenementVieController.php:39
 * @route '/api/v1/evenements'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\EvenementVieController::show
 * @see app/Http/Controllers/Api/EvenementVieController.php:107
 * @route '/api/v1/evenements/{evenement}'
 */
export const show = (args: { evenement: string | number } | [evenement: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/evenements/{evenement}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\EvenementVieController::show
 * @see app/Http/Controllers/Api/EvenementVieController.php:107
 * @route '/api/v1/evenements/{evenement}'
 */
show.url = (args: { evenement: string | number } | [evenement: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { evenement: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    evenement: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        evenement: args.evenement,
                }

    return show.definition.url
            .replace('{evenement}', parsedArgs.evenement.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\EvenementVieController::show
 * @see app/Http/Controllers/Api/EvenementVieController.php:107
 * @route '/api/v1/evenements/{evenement}'
 */
show.get = (args: { evenement: string | number } | [evenement: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\EvenementVieController::show
 * @see app/Http/Controllers/Api/EvenementVieController.php:107
 * @route '/api/v1/evenements/{evenement}'
 */
show.head = (args: { evenement: string | number } | [evenement: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})
const evenements = {
    index: Object.assign(index, index),
show: Object.assign(show, show),
}

export default evenements