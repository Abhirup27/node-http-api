import { Route, Middleware, Controller } from "../types.js";
declare class RouteHandler {
    private routes;
    addRoute(path: string, middlewares: Middleware[], controller: Controller): void;
    getRoute(path: string): Route | undefined;
    handle(path: string, req: any, res: any): Promise<void>;
}
export default RouteHandler;
//# sourceMappingURL=routeHandler.d.ts.map