import http from "http";
import type { ParsedUrlQuery } from "querystring";

export interface Req extends http.IncomingMessage {

  params: Record<string, string>;
  query: ParsedUrlQuery;
  body?: any,
  ctx?: Record<string, any>;
};

export interface Res extends http.ServerResponse {

};

export type Next = () => Promise<void>;
export type Middleware = (req: Req, res: Res, next: Next) => Promise<void> | void;
export type Controller = (req: Req, res: Res) => Promise<void> | void;


export interface Route {
  middlewares: Middleware[];
  controller: Controller;
}

export const createRoute = (
  middlewares: Middleware[],
  controller: Controller
): Route => ({
  middlewares,
  controller,
});


export type LogLevel = 'debug' | 'error' | 'warn' | 'log' | 'info';

export interface Config {
  NODE_ENV: 'development' | 'production' | 'test';
  PORT: number;
  RATE_LIMITING_WINDOW: number;
  JWT_SECRET: string;
  LOGGING: boolean;
  LOG_TO_FILE: boolean;
  LOG_LEVELS: LogLevel[];
  REDIS_HOST: string;
  REDIS_PORT: number;
}
