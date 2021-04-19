import { RouteMatch, PageRoute } from 'vite-plugin-ssr/routing/types';
export { useVueRouter };
declare function matchRoutes(routes: PageRoute[], url: string): Promise<null | undefined | RouteMatch>;
declare const useVueRouter: {
    matchRoutes: typeof matchRoutes;
};
//# sourceMappingURL=index.d.ts.map