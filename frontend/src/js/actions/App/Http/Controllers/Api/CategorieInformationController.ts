import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\CategorieInformationController::index
 * @see app/Http/Controllers/Api/CategorieInformationController.php:26
 * @route '/api/v1/categories'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/categories',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\CategorieInformationController::index
 * @see app/Http/Controllers/Api/CategorieInformationController.php:26
 * @route '/api/v1/categories'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\CategorieInformationController::index
 * @see app/Http/Controllers/Api/CategorieInformationController.php:26
 * @route '/api/v1/categories'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\CategorieInformationController::index
 * @see app/Http/Controllers/Api/CategorieInformationController.php:26
 * @route '/api/v1/categories'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\CategorieInformationController::show
 * @see app/Http/Controllers/Api/CategorieInformationController.php:70
 * @route '/api/v1/categories/{category}'
 */
export const show = (args: { category: string | number } | [category: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/categories/{category}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\CategorieInformationController::show
 * @see app/Http/Controllers/Api/CategorieInformationController.php:70
 * @route '/api/v1/categories/{category}'
 */
show.url = (args: { category: string | number } | [category: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { category: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    category: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        category: args.category,
                }

    return show.definition.url
            .replace('{category}', parsedArgs.category.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\CategorieInformationController::show
 * @see app/Http/Controllers/Api/CategorieInformationController.php:70
 * @route '/api/v1/categories/{category}'
 */
show.get = (args: { category: string | number } | [category: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\CategorieInformationController::show
 * @see app/Http/Controllers/Api/CategorieInformationController.php:70
 * @route '/api/v1/categories/{category}'
 */
show.head = (args: { category: string | number } | [category: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\CategorieInformationController::store
 * @see app/Http/Controllers/Api/CategorieInformationController.php:118
 * @route '/api/v1/categories'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/categories',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\CategorieInformationController::store
 * @see app/Http/Controllers/Api/CategorieInformationController.php:118
 * @route '/api/v1/categories'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\CategorieInformationController::store
 * @see app/Http/Controllers/Api/CategorieInformationController.php:118
 * @route '/api/v1/categories'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\CategorieInformationController::update
 * @see app/Http/Controllers/Api/CategorieInformationController.php:182
 * @route '/api/v1/categories/{category}'
 */
export const update = (args: { category: string | number } | [category: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/api/v1/categories/{category}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Api\CategorieInformationController::update
 * @see app/Http/Controllers/Api/CategorieInformationController.php:182
 * @route '/api/v1/categories/{category}'
 */
update.url = (args: { category: string | number } | [category: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { category: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    category: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        category: args.category,
                }

    return update.definition.url
            .replace('{category}', parsedArgs.category.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\CategorieInformationController::update
 * @see app/Http/Controllers/Api/CategorieInformationController.php:182
 * @route '/api/v1/categories/{category}'
 */
update.put = (args: { category: string | number } | [category: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Api\CategorieInformationController::update
 * @see app/Http/Controllers/Api/CategorieInformationController.php:182
 * @route '/api/v1/categories/{category}'
 */
update.patch = (args: { category: string | number } | [category: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Api\CategorieInformationController::destroy
 * @see app/Http/Controllers/Api/CategorieInformationController.php:240
 * @route '/api/v1/categories/{category}'
 */
export const destroy = (args: { category: string | number } | [category: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/v1/categories/{category}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\CategorieInformationController::destroy
 * @see app/Http/Controllers/Api/CategorieInformationController.php:240
 * @route '/api/v1/categories/{category}'
 */
destroy.url = (args: { category: string | number } | [category: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { category: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    category: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        category: args.category,
                }

    return destroy.definition.url
            .replace('{category}', parsedArgs.category.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\CategorieInformationController::destroy
 * @see app/Http/Controllers/Api/CategorieInformationController.php:240
 * @route '/api/v1/categories/{category}'
 */
destroy.delete = (args: { category: string | number } | [category: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})
const CategorieInformationController = { index, show, store, update, destroy }

export default CategorieInformationController