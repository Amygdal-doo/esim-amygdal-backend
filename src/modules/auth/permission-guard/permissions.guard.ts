import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Role } from '@prisma/client';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    // console.log(requiredRoles);

    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    // return requiredRoles.some((role) => user.role?.includes(role));
    return requiredRoles.some((role) => {
      //user.roles?.includes(role),
      const hasRole = requiredRoles.some((role) => user.role === role);
      if (!hasRole) {
        throw new ForbiddenException(
          'You do not have the necessary permissions to access this resource.',
        );
      }
      return true;
    });
  }
}
