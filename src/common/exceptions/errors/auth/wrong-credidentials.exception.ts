/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus } from '@nestjs/common';

export class WrongCredidentialsException extends HttpException {
  constructor() {
    super('Forbidden', HttpStatus.FORBIDDEN);
    this.name = 'Incorrect Credidentials.';
    this.message = 'Wrong Credidentials.';
  }
}