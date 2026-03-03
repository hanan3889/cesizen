import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\Api\DiagnosticStressController::index
 * @see app/Http/Controllers/Api/DiagnosticStressController.php:29
 * @route '/api/v1/diagnostics'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/diagnostics',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\DiagnosticStressController::index
 * @see app/Http/Controllers/Api/DiagnosticStressController.php:29
 * @route '/api/v1/diagnostics'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\DiagnosticStressController::index
 * @see app/Http/Controllers/Api/DiagnosticStressController.php:29
 * @route '/api/v1/diagnostics'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\DiagnosticStressController::index
 * @see app/Http/Controllers/Api/DiagnosticStressController.php:29
 * @route '/api/v1/diagnostics'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\DiagnosticStressController::store
 * @see app/Http/Controllers/Api/DiagnosticStressController.php:70
 * @route '/api/v1/diagnostics'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/diagnostics',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\DiagnosticStressController::store
 * @see app/Http/Controllers/Api/DiagnosticStressController.php:70
 * @route '/api/v1/diagnostics'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\DiagnosticStressController::store
 * @see app/Http/Controllers/Api/DiagnosticStressController.php:70
 * @route '/api/v1/diagnostics'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\DiagnosticStressController::show
 * @see app/Http/Controllers/Api/DiagnosticStressController.php:131
 * @route '/api/v1/diagnostics/{diagnostic}'
 */
export const show = (args: { diagnostic: string | number } | [diagnostic: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/diagnostics/{diagnostic}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\DiagnosticStressController::show
 * @see app/Http/Controllers/Api/DiagnosticStressController.php:131
 * @route '/api/v1/diagnostics/{diagnostic}'
 */
show.url = (args: { diagnostic: string | number } | [diagnostic: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { diagnostic: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    diagnostic: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        diagnostic: args.diagnostic,
                }

    return show.definition.url
            .replace('{diagnostic}', parsedArgs.diagnostic.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\DiagnosticStressController::show
 * @see app/Http/Controllers/Api/DiagnosticStressController.php:131
 * @route '/api/v1/diagnostics/{diagnostic}'
 */
show.get = (args: { diagnostic: string | number } | [diagnostic: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\DiagnosticStressController::show
 * @see app/Http/Controllers/Api/DiagnosticStressController.php:131
 * @route '/api/v1/diagnostics/{diagnostic}'
 */
show.head = (args: { diagnostic: string | number } | [diagnostic: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\DiagnosticStressController::update
 * @see app/Http/Controllers/Api/DiagnosticStressController.php:0
 * @route '/api/v1/diagnostics/{diagnostic}'
 */
export const update = (args: { diagnostic: string | number } | [diagnostic: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/api/v1/diagnostics/{diagnostic}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Api\DiagnosticStressController::update
 * @see app/Http/Controllers/Api/DiagnosticStressController.php:0
 * @route '/api/v1/diagnostics/{diagnostic}'
 */
update.url = (args: { diagnostic: string | number } | [diagnostic: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { diagnostic: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    diagnostic: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        diagnostic: args.diagnostic,
                }

    return update.definition.url
            .replace('{diagnostic}', parsedArgs.diagnostic.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\DiagnosticStressController::update
 * @see app/Http/Controllers/Api/DiagnosticStressController.php:0
 * @route '/api/v1/diagnostics/{diagnostic}'
 */
update.put = (args: { diagnostic: string | number } | [diagnostic: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Api\DiagnosticStressController::update
 * @see app/Http/Controllers/Api/DiagnosticStressController.php:0
 * @route '/api/v1/diagnostics/{diagnostic}'
 */
update.patch = (args: { diagnostic: string | number } | [diagnostic: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Api\DiagnosticStressController::destroy
 * @see app/Http/Controllers/Api/DiagnosticStressController.php:181
 * @route '/api/v1/diagnostics/{diagnostic}'
 */
export const destroy = (args: { diagnostic: string | number } | [diagnostic: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/v1/diagnostics/{diagnostic}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\DiagnosticStressController::destroy
 * @see app/Http/Controllers/Api/DiagnosticStressController.php:181
 * @route '/api/v1/diagnostics/{diagnostic}'
 */
destroy.url = (args: { diagnostic: string | number } | [diagnostic: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { diagnostic: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    diagnostic: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        diagnostic: args.diagnostic,
                }

    return destroy.definition.url
            .replace('{diagnostic}', parsedArgs.diagnostic.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\DiagnosticStressController::destroy
 * @see app/Http/Controllers/Api/DiagnosticStressController.php:181
 * @route '/api/v1/diagnostics/{diagnostic}'
 */
destroy.delete = (args: { diagnostic: string | number } | [diagnostic: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})
const diagnostics = {
    index: Object.assign(index, index),
store: Object.assign(store, store),
show: Object.assign(show, show),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
}

export default diagnostics