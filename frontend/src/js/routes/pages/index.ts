import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\Api\PageInformationController::index
 * @see app/Http/Controllers/Api/PageInformationController.php:35
 * @route '/api/v1/pages'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/pages',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\PageInformationController::index
 * @see app/Http/Controllers/Api/PageInformationController.php:35
 * @route '/api/v1/pages'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\PageInformationController::index
 * @see app/Http/Controllers/Api/PageInformationController.php:35
 * @route '/api/v1/pages'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\PageInformationController::index
 * @see app/Http/Controllers/Api/PageInformationController.php:35
 * @route '/api/v1/pages'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\PageInformationController::show
 * @see app/Http/Controllers/Api/PageInformationController.php:87
 * @route '/api/v1/pages/{page}'
 */
export const show = (args: { page: string | number } | [page: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/pages/{page}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\PageInformationController::show
 * @see app/Http/Controllers/Api/PageInformationController.php:87
 * @route '/api/v1/pages/{page}'
 */
show.url = (args: { page: string | number } | [page: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { page: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    page: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        page: args.page,
                }

    return show.definition.url
            .replace('{page}', parsedArgs.page.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\PageInformationController::show
 * @see app/Http/Controllers/Api/PageInformationController.php:87
 * @route '/api/v1/pages/{page}'
 */
show.get = (args: { page: string | number } | [page: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\PageInformationController::show
 * @see app/Http/Controllers/Api/PageInformationController.php:87
 * @route '/api/v1/pages/{page}'
 */
show.head = (args: { page: string | number } | [page: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\PageInformationController::store
 * @see app/Http/Controllers/Api/PageInformationController.php:137
 * @route '/api/v1/pages'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/pages',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\PageInformationController::store
 * @see app/Http/Controllers/Api/PageInformationController.php:137
 * @route '/api/v1/pages'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\PageInformationController::store
 * @see app/Http/Controllers/Api/PageInformationController.php:137
 * @route '/api/v1/pages'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\PageInformationController::update
 * @see app/Http/Controllers/Api/PageInformationController.php:209
 * @route '/api/v1/pages/{page}'
 */
export const update = (args: { page: string | number } | [page: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/api/v1/pages/{page}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Api\PageInformationController::update
 * @see app/Http/Controllers/Api/PageInformationController.php:209
 * @route '/api/v1/pages/{page}'
 */
update.url = (args: { page: string | number } | [page: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { page: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    page: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        page: args.page,
                }

    return update.definition.url
            .replace('{page}', parsedArgs.page.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\PageInformationController::update
 * @see app/Http/Controllers/Api/PageInformationController.php:209
 * @route '/api/v1/pages/{page}'
 */
update.put = (args: { page: string | number } | [page: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Api\PageInformationController::update
 * @see app/Http/Controllers/Api/PageInformationController.php:209
 * @route '/api/v1/pages/{page}'
 */
update.patch = (args: { page: string | number } | [page: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Api\PageInformationController::destroy
 * @see app/Http/Controllers/Api/PageInformationController.php:264
 * @route '/api/v1/pages/{page}'
 */
export const destroy = (args: { page: string | number } | [page: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/v1/pages/{page}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\PageInformationController::destroy
 * @see app/Http/Controllers/Api/PageInformationController.php:264
 * @route '/api/v1/pages/{page}'
 */
destroy.url = (args: { page: string | number } | [page: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { page: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    page: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        page: args.page,
                }

    return destroy.definition.url
            .replace('{page}', parsedArgs.page.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\PageInformationController::destroy
 * @see app/Http/Controllers/Api/PageInformationController.php:264
 * @route '/api/v1/pages/{page}'
 */
destroy.delete = (args: { page: string | number } | [page: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})
const pages = {
    index: Object.assign(index, index),
show: Object.assign(show, show),
store: Object.assign(store, store),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
}

export default pages