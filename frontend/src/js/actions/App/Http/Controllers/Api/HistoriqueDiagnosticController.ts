import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\HistoriqueDiagnosticController::recent
 * @see app/Http/Controllers/Api/HistoriqueDiagnosticController.php:59
 * @route '/api/v1/historiques/recent'
 */
export const recent = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: recent.url(options),
    method: 'get',
})

recent.definition = {
    methods: ["get","head"],
    url: '/api/v1/historiques/recent',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\HistoriqueDiagnosticController::recent
 * @see app/Http/Controllers/Api/HistoriqueDiagnosticController.php:59
 * @route '/api/v1/historiques/recent'
 */
recent.url = (options?: RouteQueryOptions) => {
    return recent.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\HistoriqueDiagnosticController::recent
 * @see app/Http/Controllers/Api/HistoriqueDiagnosticController.php:59
 * @route '/api/v1/historiques/recent'
 */
recent.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: recent.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\HistoriqueDiagnosticController::recent
 * @see app/Http/Controllers/Api/HistoriqueDiagnosticController.php:59
 * @route '/api/v1/historiques/recent'
 */
recent.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: recent.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\HistoriqueDiagnosticController::index
 * @see app/Http/Controllers/Api/HistoriqueDiagnosticController.php:29
 * @route '/api/v1/historiques'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/historiques',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\HistoriqueDiagnosticController::index
 * @see app/Http/Controllers/Api/HistoriqueDiagnosticController.php:29
 * @route '/api/v1/historiques'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\HistoriqueDiagnosticController::index
 * @see app/Http/Controllers/Api/HistoriqueDiagnosticController.php:29
 * @route '/api/v1/historiques'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\HistoriqueDiagnosticController::index
 * @see app/Http/Controllers/Api/HistoriqueDiagnosticController.php:29
 * @route '/api/v1/historiques'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\HistoriqueDiagnosticController::store
 * @see app/Http/Controllers/Api/HistoriqueDiagnosticController.php:103
 * @route '/api/v1/historiques'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/historiques',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\HistoriqueDiagnosticController::store
 * @see app/Http/Controllers/Api/HistoriqueDiagnosticController.php:103
 * @route '/api/v1/historiques'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\HistoriqueDiagnosticController::store
 * @see app/Http/Controllers/Api/HistoriqueDiagnosticController.php:103
 * @route '/api/v1/historiques'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\HistoriqueDiagnosticController::destroy
 * @see app/Http/Controllers/Api/HistoriqueDiagnosticController.php:144
 * @route '/api/v1/historiques/{historique}'
 */
export const destroy = (args: { historique: string | number } | [historique: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/v1/historiques/{historique}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\HistoriqueDiagnosticController::destroy
 * @see app/Http/Controllers/Api/HistoriqueDiagnosticController.php:144
 * @route '/api/v1/historiques/{historique}'
 */
destroy.url = (args: { historique: string | number } | [historique: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { historique: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    historique: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        historique: args.historique,
                }

    return destroy.definition.url
            .replace('{historique}', parsedArgs.historique.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\HistoriqueDiagnosticController::destroy
 * @see app/Http/Controllers/Api/HistoriqueDiagnosticController.php:144
 * @route '/api/v1/historiques/{historique}'
 */
destroy.delete = (args: { historique: string | number } | [historique: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})
const HistoriqueDiagnosticController = { recent, index, store, destroy }

export default HistoriqueDiagnosticController