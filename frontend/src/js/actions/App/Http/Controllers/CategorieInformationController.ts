import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\CategorieInformationController::show
 * @see app/Http/Controllers/CategorieInformationController.php:14
 * @route '/categories/{categoryId}'
 */
export const show = (args: { categoryId: string | number } | [categoryId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/categories/{categoryId}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CategorieInformationController::show
 * @see app/Http/Controllers/CategorieInformationController.php:14
 * @route '/categories/{categoryId}'
 */
show.url = (args: { categoryId: string | number } | [categoryId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { categoryId: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    categoryId: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        categoryId: args.categoryId,
                }

    return show.definition.url
            .replace('{categoryId}', parsedArgs.categoryId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CategorieInformationController::show
 * @see app/Http/Controllers/CategorieInformationController.php:14
 * @route '/categories/{categoryId}'
 */
show.get = (args: { categoryId: string | number } | [categoryId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CategorieInformationController::show
 * @see app/Http/Controllers/CategorieInformationController.php:14
 * @route '/categories/{categoryId}'
 */
show.head = (args: { categoryId: string | number } | [categoryId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})
const CategorieInformationController = { show }

export default CategorieInformationController