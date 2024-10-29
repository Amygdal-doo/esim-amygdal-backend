import { HttpException, HttpStatus } from '@nestjs/common';

export class ResetTokenException extends HttpException {
  constructor() {
    super('Unauthorized', HttpStatus.UNAUTHORIZED);
    this.name = 'Invalid token';
    this.message = 'Password reset token is invalid or has expired.';
  }
}
