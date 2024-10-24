import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class HttpLoggerMiddleware implements NestMiddleware {
  public logger = new Logger('Response');
  constructor() {}
  use(req: Request, res: Response, next: () => void) {
    const { method, originalUrl: url /*, baseUrl: path, query: queryParams*/ } =
      req;
    const reqTime = new Date().getTime();
    // this.logger.log(
    //   `${method} ${url} ${path} ${queryParams}`
    // )
    res.on('finish', () => {
      const { statusCode } = res;
      const resTime = new Date().getTime();
      if (statusCode === 200 || statusCode === 201) {
        this.logger.log(
          `${method} ${url} ${statusCode} - ${resTime - reqTime} ms`,
        );
      }
    });
    next();
  }
}
