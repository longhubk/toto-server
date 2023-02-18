import winston from 'winston';
import config from 'config';
import { createWriteStream } from "fs";



export interface Logger {
  trace(message?: any, ...params: any[]): void;
  debug(message?: any, ...params: any[]): void;
  info(message?: any, ...params: any[]): void;
  warn(message?: any, ...params: any[]): void;
  error(message?: any, ...params: any[]): void;
}

class WinstonLogger implements Logger {
  module: string;
  logger: winston.Logger;

  constructor(module?: string) {
    const loggerOpts = <winston.LoggerOptions>config.get('logger');
    this.module = module || 'default';
    this.logger = winston.createLogger({
      ...loggerOpts,
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.errors({ stack: loggerOpts.level === 'debug' ? true : false }),
        winston.format.colorize(),
        winston.format.prettyPrint(),
        winston.format.splat(),
        winston.format.printf(log => {
          if (log instanceof Error) {
            return `[${log.timestamp}] [${log.level}] [${this.module}] - ${log.message} ${log.stack}`;
          } else {
            return `[${log.timestamp}] [${log.level}] [${this.module}] - ${log.message}`;
          }
        }),
      ),
      defaultMeta: { service: 'game' },
      transports: [
        new winston.transports.Stream({
          stream: createWriteStream("logFile.log", { flags: 'a' }),

        }),
        new winston.transports.Console(),
      ],
    });
  }

  trace(message?: any, ...params: any[]): void {
    this.logger.silly(message, ...params);
  }

  debug(message?: any, ...params: any[]): void {
    this.logger.debug(message, ...params);
  }

  info(message?: any, ...params: any[]): void {
    this.logger.info(message, ...params);
  }

  warn(message?: any, ...params: any[]): void {
    this.logger.warn(message, ...params);
  }

  error(message?: any, ...params: any[]): void {
    this.logger.error(message, ...params);
  }
}

export function getLogger(module?: string): Logger {
  return new WinstonLogger(module);
}