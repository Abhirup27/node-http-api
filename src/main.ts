import http from "http";
import type { Req, Res, Next, Middleware, Controller } from "./types.js";
import RouteHandler from "./RouteHandler/routeHandler.js";
import config from "./app_config.js";


function bootstrap() {
  const app = new RouteHandler();
  const loggerMiddleware = async (req: Req, _res: Res, next: Next) => {
    console.log("Request received:", req.url);
    await next();
  };
  const someMiddleware: Middleware = async (req: Req, _res: Res, next: Next) => {
    console.log("Request headers:", req.headers);
    await next();
  };
  const signupController: Controller = async (_req: Req, res: Res) => {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Signup successful!");
  };

  app.addRoute("/signup", [loggerMiddleware, someMiddleware], signupController);

  return app;
}
const app = bootstrap();

// create HTTP server and use the route handler
const server = http.createServer(async (req, res) => {
  if (!req.url) return;

  await app.handle(req.url, req, res);
});

server.listen(config.PORT, () => {
  console.log("Listening on port ", config.PORT);
});
