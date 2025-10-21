export default class RouteHandler {
    constructor() {
        this.routes = new Map();
    }
    addRoute(path, middlewares, controller) {
        this.routes.set(path, { middlewares, controller });
    }
    getRoute(path) {
        return this.routes.get(path);
    }
    async handle(path, req, res) {
        const route = this.routes.get(path);
        if (!route) {
            res.statusCode = 404;
            res.end("Not Found");
            return;
        }
        const { middlewares, controller } = route;
        let i = 0;
        const next = async () => {
            const mw = middlewares[i++];
            if (mw) {
                await mw(req, res, next);
            }
            else {
                await controller(req, res);
            }
        };
        await next();
    }
}
