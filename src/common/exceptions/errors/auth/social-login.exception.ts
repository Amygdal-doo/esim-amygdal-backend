/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus } from '@nestjs/common';

export class SocialUserExistException extends HttpException {
  constructor(socialType?: string) {
    super('Forbidden', HttpStatus.FORBIDDEN);
    this.name = 'User with this email already exist';
    this.message =
      'User already exists, but ' +
      socialType +
      " account was not connected to user's account";
  }
}
