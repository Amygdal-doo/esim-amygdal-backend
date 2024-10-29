/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus } from "@nestjs/common";

export class ExistingUserException extends HttpException {
  constructor() {
    super('Conflict', HttpStatus.CONFLICT);
    this.name = 'Existing user'
    this.message = 'User with that email already exists in the database.'
  }
}