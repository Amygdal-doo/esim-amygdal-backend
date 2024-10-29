/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus } from "@nestjs/common";

export class PasswordException extends HttpException {
  constructor() {
    super('Forbidden', HttpStatus.FORBIDDEN);
    this.name = 'Incorrect password.'
    this.message = 'Passwords do not match.'
  }
}