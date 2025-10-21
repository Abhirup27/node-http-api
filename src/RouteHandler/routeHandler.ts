import { Route, Middleware, Controller } from "../types.js";

class RouteHandler {
  private routes: Map<string, Route> = new Map();

  addRoute(path: string, middlewares: Middleware[], controller: Controller) {
    this.routes.set(path, { middlewares, controller });
  }

  getRoute(path: string): Route | undefined {
    return this.routes.get(path);
  }

  async handle(path: string, req: any, res: any) {
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
      } else {
        await controller(req, res);
      }
    };

    await next();
  }
}

export default RouteHandler;


