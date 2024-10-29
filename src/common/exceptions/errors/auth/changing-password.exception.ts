/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus } from '@nestjs/common';

export class ChangingPasswordException extends HttpException {
  constructor() {
    super('Conflict', HttpStatus.CONFLICT);
    this.name = 'Incorrect password.';
    this.message = 'Password and repeated password do not match.';
  }
}
