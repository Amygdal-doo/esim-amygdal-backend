/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus } from '@nestjs/common';

export class NotCreatedByUserException extends HttpException {
  constructor() {
    super('Forbidden', HttpStatus.FORBIDDEN);
    this.name = 'Not created by logged user.';
    this.message = 'Only the user with right permissions can Continue';
  }
}
