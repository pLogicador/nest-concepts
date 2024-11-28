import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class AuthTokenInterceptor implements NestInterceptor {
  async intercept(context: ExecutionContext, next: CallHandler<any>) {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];

    // Check the token
    if (!token || token != 'HereComesTheToken') {
      throw new UnauthorizedException('User not logged in.');
    }

    return next.handle();
  }
}
