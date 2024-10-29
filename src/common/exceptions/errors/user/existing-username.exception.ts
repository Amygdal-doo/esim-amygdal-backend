/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus } from "@nestjs/common";

export class ExistingUsernameException extends HttpException {
  constructor() {
    super('Conflict', HttpStatus.CONFLICT);
    this.name = 'Existing username'
    this.message = 'User with that username already exists in the database.'
  }
}