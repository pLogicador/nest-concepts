import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';

export class AddHeaderInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    console.log('AddHeaderInterceptor executed.');

    const response = context.switchToHttp().getResponse();

    response.setHeader('X-Custom-Header', 'The Header value');

    return next.handle();
  }
}
