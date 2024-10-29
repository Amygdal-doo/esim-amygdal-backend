import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class EmailConfirmationGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    // console.log({user: request.user});

    if (!request.user?.isEmailConfirmed) {
      throw new UnauthorizedException('Confirm your email first');
    }

    return true;
  }
}
