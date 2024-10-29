/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus } from "@nestjs/common";

export class PasswordSocialException extends HttpException {
  constructor() {
    super('Forbidden', HttpStatus.FORBIDDEN);
    this.name = 'Passwords change not allowed'
    this.message = 'Social User cant have password.'
  }
}