"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useVueRouter = void 0;
const vue_router_1 = require("vue-router");
async function matchRoutes(routes, url) {
    routes.forEach(route => {
        if (typeof route.pageRoute !== 'string') {
            throw new Error(`When using Vue Router integration, route functions must return Vue Router paths, not objects.`);
        }
    });
    const router = vue_router_1.createRouter({
        routes: routes.map(route => ({ name: route.id, path: route.pageRoute, component: {} })),
        history: vue_router_1.createMemoryHistory()
    });
    await router.push(url);
    await router.isReady();
    if (router.currentRoute.value.matched && router.currentRoute.value.matched.length) {
        return {
            pageId: router.currentRoute.value.name,
            routeParams: router.currentRoute.value.params
        };
    }
    return null;
}
const useVueRouter = { matchRoutes };
exports.useVueRouter = useVueRouter;
//# sourceMappingURL=index.js.map