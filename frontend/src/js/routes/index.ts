import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../wayfinder'
/**
 * @see routes/web.php:20
 * @route '/login'
 */
export const login = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: login.url(options),
    method: 'get',
})

login.definition = {
    methods: ["get","head"],
    url: '/login',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:20
 * @route '/login'
 */
login.url = (options?: RouteQueryOptions) => {
    return login.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:20
 * @route '/login'
 */
login.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: login.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:20
 * @route '/login'
 */
login.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: login.url(options),
    method: 'head',
})

/**
 * @see routes/web.php:37
 * @route '/logout'
 */
export const logout = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: logout.url(options),
    method: 'post',
})

logout.definition = {
    methods: ["post"],
    url: '/logout',
} satisfies RouteDefinition<["post"]>

/**
 * @see routes/web.php:37
 * @route '/logout'
 */
logout.url = (options?: RouteQueryOptions) => {
    return logout.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:37
 * @route '/logout'
 */
logout.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: logout.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Auth\RegisteredUserController::register
 * @see app/Http/Controllers/Auth/RegisteredUserController.php:16
 * @route '/register'
 */
export const register = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: register.url(options),
    method: 'get',
})

register.definition = {
    methods: ["get","head"],
    url: '/register',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Auth\RegisteredUserController::register
 * @see app/Http/Controllers/Auth/RegisteredUserController.php:16
 * @route '/register'
 */
register.url = (options?: RouteQueryOptions) => {
    return register.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Auth\RegisteredUserController::register
 * @see app/Http/Controllers/Auth/RegisteredUserController.php:16
 * @route '/register'
 */
register.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: register.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Auth\RegisteredUserController::register
 * @see app/Http/Controllers/Auth/RegisteredUserController.php:16
 * @route '/register'
 */
register.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: register.url(options),
    method: 'head',
})

/**
 * @see routes/web.php:24
 * @route '/informations'
 */
export const informations = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: informations.url(options),
    method: 'get',
})

informations.definition = {
    methods: ["get","head"],
    url: '/informations',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:24
 * @route '/informations'
 */
informations.url = (options?: RouteQueryOptions) => {
    return informations.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:24
 * @route '/informations'
 */
informations.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: informations.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:24
 * @route '/informations'
 */
informations.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: informations.url(options),
    method: 'head',
})

/**
 * @see routes/web.php:50
 * @route '/dashboard'
 */
export const dashboard = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

dashboard.definition = {
    methods: ["get","head"],
    url: '/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:50
 * @route '/dashboard'
 */
dashboard.url = (options?: RouteQueryOptions) => {
    return dashboard.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:50
 * @route '/dashboard'
 */
dashboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:50
 * @route '/dashboard'
 */
dashboard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboard.url(options),
    method: 'head',
})

/**
 * Route to resend email verification notification.
 * @see \Illuminate\Foundation\Auth\EmailVerificationRequest
 */
export const resendVerification = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: resendVerification.url(options),
    method: 'post',
})

resendVerification.definition = {
    methods: ["post"],
    url: '/email/verification-notification',
} satisfies RouteDefinition<["post"]>

resendVerification.url = (options?: RouteQueryOptions) => {
    return resendVerification.definition.url + queryParams(options)
}

resendVerification.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: resendVerification.url(options),
    method: 'post',
})
