/* eslint-disable prettier/prettier */
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  logger = new Logger()
  catch(exception: HttpException, host: ArgumentsHost) {

    //In case we throw exceptions we created, we may need these objects
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const message = exception.message;
    const name = exception.name

    //For handling class-validator package errors we need this approach

    const validatorException = exception.getResponse();
    const errorType = validatorException["error"];
    const errorList = validatorException["message"];
    const statusCode = validatorException["statusCode"];

    // logging

    this.logger.error(
      `${request.method} ${request.originalUrl} ${status} error: ${exception.message}`
    )

    return response
      .status(statusCode ?? status)
      .json({
        statusCode: statusCode ?? status,
        errors: errorList ?? [message],
        type: errorType ?? name
      });
  }
}