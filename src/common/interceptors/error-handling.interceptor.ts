import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, throwError } from 'rxjs';

export class ErrorHandlingInterceptor implements NestInterceptor {
  async intercept(context: ExecutionContext, next: CallHandler<any>) {
    console.log('ErrorHandlingInterceptor executed BEFORE.');

    //await new Promise(resolve => setTimeout(resolve, 3000));

    return next.handle().pipe(
      catchError(error => {
        return throwError(() => {
          if (error.name === 'NotFoundException') {
            return new BadRequestException(error.message);
          }

          return new BadRequestException('Unknown error occurred.');
        });
      }),
    );
  }
}
