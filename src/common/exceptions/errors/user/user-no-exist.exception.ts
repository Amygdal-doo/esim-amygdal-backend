import { HttpException, HttpStatus } from '@nestjs/common';

const msg = 'Bad Request User Not Found';

export class UserNotFoundException extends HttpException {
  constructor(content?: string) {
    super('Not Found', HttpStatus.NOT_FOUND);
    this.name = 'User not found ';
    this.message = content ? content : msg;
  }
}
