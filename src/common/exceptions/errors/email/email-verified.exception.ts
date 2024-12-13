/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus } from '@nestjs/common';

export class EmailVerifiedException extends HttpException {
  constructor() {
    super('BadRequest', HttpStatus.BAD_REQUEST);
    this.name = 'Email verified.';
    this.message = 'User email is already verified.';
  }
}
