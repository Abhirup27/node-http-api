import { Config, LogLevel } from "./types.js";
import dotenv from "dotenv";
import Cryto from "node:crypto";
import path from 'path';

const NODE_ENV = process.env.NODE_ENV as "development" | "production" | "test" || 'development';


const envFiles = [
  `.env.${NODE_ENV}.local`,
  `.env.${NODE_ENV}`,
  '.env'
];

if (NODE_ENV !== 'production') {
  envFiles.forEach(file => {
    dotenv.config({ path: path.resolve(process.cwd(), file) });
  });
}


const DEFAULT_CONFIG: Config = {
  NODE_ENV: NODE_ENV,
  PORT: 3000,
  RATE_LIMITING_WINDOW: 60,
  LOGGING: false,
  LOG_LEVELS: ['debug'],

  LOG_TO_FILE: false,
  REDIS_HOST: 'localhost',
  REDIS_PORT: 6379,

  JWT_SECRET: Cryto.randomBytes(32).toString('hex'),
};

const VALID_LOG_LEVELS: LogLevel[] = ['debug', 'error', 'warn', 'log', 'info'];

// function isLogLevel(value: string): value is LogLevel {
//   return ['debug', 'error', 'warn', 'log', 'info'].includes(value);
// }
//

// Parse and validate configuration
const parseConfig = (): Config => {
  const env = process.env;
  const errors: string[] = [];

  if (!env.NODE_ENV) {
    env.NODE_ENV = 'development';
  } else if (!['development', 'production', 'test'].includes(env.NODE_ENV)) {
    errors.push(`NODE_ENV: Invalid environment '${env.NODE_ENV}'. Must be one of: development, production, test`);
  }



  let port: number = DEFAULT_CONFIG.PORT;
  if (env.PORT) {
    port = parseInt(env.PORT);
    if (isNaN(port)) {
      errors.push(`PORT: '${env.PORT}' is not a valid number`);
    }
  }

  let rateLimitingWindow: number = DEFAULT_CONFIG.RATE_LIMITING_WINDOW;
  if (env.RATE_LIMITING_WINDOW) {
    rateLimitingWindow = parseInt(env.RATE_LIMITING_WINDOW);
    if (isNaN(rateLimitingWindow)) {
      errors.push(`RATE_LIMITING_WINDOW: '${env.RATE_LIMITING_WINDOW}' is not a valid number`);
    }
  }

  const logging = env.LOGGING ? env.LOGGING === 'true' : DEFAULT_CONFIG.LOGGING;
  const logToFile = env.LOG_TO_FILE ? env.LOG_TO_FILE === 'true' : DEFAULT_CONFIG.LOG_TO_FILE;

  // Parse log levels
  let logLevels: LogLevel[] = [];
  if (env.LOG_LEVELS) {
    const levels = env.LOG_LEVELS.split(',');
    for (const level of levels) {
      if (!VALID_LOG_LEVELS.includes(level as LogLevel)) {
        errors.push(`LOG_LEVELS: '${level}' is not a valid log level. Valid options: ${VALID_LOG_LEVELS.join(', ')}`);
      } else {
        logLevels.push(level as LogLevel);
      }
    }
  }

  let redisPort: number = DEFAULT_CONFIG.REDIS_PORT;
  if (env.REDIS_PORT) {
    redisPort = parseInt(env.REDIS_PORT);
    if (isNaN(redisPort)) {
      errors.push(`REDIS_PORT: '${env.REDIS_PORT}' is not a valid number`);
    }
  }

  let jwtSecret: string = DEFAULT_CONFIG.JWT_SECRET;
  if (env.JWT_SECRET) {
    jwtSecret = env.JWT_SECRET;
  } else {
    console.log("No JWT secret provided. Generating Random.");
  }
  if (errors.length > 0) {
    console.error('Invalid environment variables:');
    errors.forEach(err => console.error(`  - ${err}`));
    process.exit(1);
  }

  return {
    NODE_ENV: env.NODE_ENV as 'development' | 'production' | 'test',
    PORT: port,
    RATE_LIMITING_WINDOW: rateLimitingWindow,
    JWT_SECRET: jwtSecret,
    LOGGING: logging,
    LOG_TO_FILE: logToFile,
    LOG_LEVELS: logLevels,
    REDIS_HOST: env.REDIS_HOST || DEFAULT_CONFIG.REDIS_HOST,
    REDIS_PORT: redisPort,
  };
};

const config = parseConfig();
export default config;

