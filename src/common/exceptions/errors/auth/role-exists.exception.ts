/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus } from '@nestjs/common';
import { Role } from '@prisma/client';

export class ExistingRoleException extends HttpException {
  constructor(role?: Role) {
    super('Bad Request', HttpStatus.BAD_REQUEST);
    this.name = 'Role already exist exception';
    this.message = 'User is already a ' + role;
  }
}
