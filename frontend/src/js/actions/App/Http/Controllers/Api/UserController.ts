import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\UserController::resetPassword
 * @see app/Http/Controllers/Api/UserController.php:283
 * @route '/api/v1/users/{id}/reset-password'
 */
export const resetPassword = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: resetPassword.url(args, options),
    method: 'post',
})

resetPassword.definition = {
    methods: ["post"],
    url: '/api/v1/users/{id}/reset-password',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\UserController::resetPassword
 * @see app/Http/Controllers/Api/UserController.php:283
 * @route '/api/v1/users/{id}/reset-password'
 */
resetPassword.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    id: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        id: args.id,
                }

    return resetPassword.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\UserController::resetPassword
 * @see app/Http/Controllers/Api/UserController.php:283
 * @route '/api/v1/users/{id}/reset-password'
 */
resetPassword.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: resetPassword.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\UserController::statistiques
 * @see app/Http/Controllers/Api/UserController.php:325
 * @route '/api/v1/users/statistiques'
 */
export const statistiques = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: statistiques.url(options),
    method: 'get',
})

statistiques.definition = {
    methods: ["get","head"],
    url: '/api/v1/users/statistiques',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\UserController::statistiques
 * @see app/Http/Controllers/Api/UserController.php:325
 * @route '/api/v1/users/statistiques'
 */
statistiques.url = (options?: RouteQueryOptions) => {
    return statistiques.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\UserController::statistiques
 * @see app/Http/Controllers/Api/UserController.php:325
 * @route '/api/v1/users/statistiques'
 */
statistiques.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: statistiques.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\UserController::statistiques
 * @see app/Http/Controllers/Api/UserController.php:325
 * @route '/api/v1/users/statistiques'
 */
statistiques.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: statistiques.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\UserController::index
 * @see app/Http/Controllers/Api/UserController.php:35
 * @route '/api/v1/users'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/users',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\UserController::index
 * @see app/Http/Controllers/Api/UserController.php:35
 * @route '/api/v1/users'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\UserController::index
 * @see app/Http/Controllers/Api/UserController.php:35
 * @route '/api/v1/users'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\UserController::index
 * @see app/Http/Controllers/Api/UserController.php:35
 * @route '/api/v1/users'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\UserController::store
 * @see app/Http/Controllers/Api/UserController.php:0
 * @route '/api/v1/users'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/users',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\UserController::store
 * @see app/Http/Controllers/Api/UserController.php:0
 * @route '/api/v1/users'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\UserController::store
 * @see app/Http/Controllers/Api/UserController.php:0
 * @route '/api/v1/users'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\UserController::show
 * @see app/Http/Controllers/Api/UserController.php:86
 * @route '/api/v1/users/{user}'
 */
export const show = (args: { user: string | number } | [user: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/users/{user}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\UserController::show
 * @see app/Http/Controllers/Api/UserController.php:86
 * @route '/api/v1/users/{user}'
 */
show.url = (args: { user: string | number } | [user: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    user: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        user: args.user,
                }

    return show.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\UserController::show
 * @see app/Http/Controllers/Api/UserController.php:86
 * @route '/api/v1/users/{user}'
 */
show.get = (args: { user: string | number } | [user: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\UserController::show
 * @see app/Http/Controllers/Api/UserController.php:86
 * @route '/api/v1/users/{user}'
 */
show.head = (args: { user: string | number } | [user: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\UserController::update
 * @see app/Http/Controllers/Api/UserController.php:160
 * @route '/api/v1/users/{user}'
 */
export const update = (args: { user: string | number } | [user: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/api/v1/users/{user}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Api\UserController::update
 * @see app/Http/Controllers/Api/UserController.php:160
 * @route '/api/v1/users/{user}'
 */
update.url = (args: { user: string | number } | [user: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    user: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        user: args.user,
                }

    return update.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\UserController::update
 * @see app/Http/Controllers/Api/UserController.php:160
 * @route '/api/v1/users/{user}'
 */
update.put = (args: { user: string | number } | [user: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Api\UserController::update
 * @see app/Http/Controllers/Api/UserController.php:160
 * @route '/api/v1/users/{user}'
 */
update.patch = (args: { user: string | number } | [user: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Api\UserController::destroy
 * @see app/Http/Controllers/Api/UserController.php:218
 * @route '/api/v1/users/{user}'
 */
export const destroy = (args: { user: string | number } | [user: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/v1/users/{user}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\UserController::destroy
 * @see app/Http/Controllers/Api/UserController.php:218
 * @route '/api/v1/users/{user}'
 */
destroy.url = (args: { user: string | number } | [user: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    user: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        user: args.user,
                }

    return destroy.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\UserController::destroy
 * @see app/Http/Controllers/Api/UserController.php:218
 * @route '/api/v1/users/{user}'
 */
destroy.delete = (args: { user: string | number } | [user: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})
const UserController = { resetPassword, statistiques, index, store, show, update, destroy }

export default UserController