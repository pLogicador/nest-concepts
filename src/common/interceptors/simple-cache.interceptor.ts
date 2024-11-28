import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { of, tap } from 'rxjs';

@Injectable()
export class SimpleCacheInterceptor implements NestInterceptor {
  private readonly cache = new Map();

  async intercept(context: ExecutionContext, next: CallHandler<any>) {
    console.log('SimpleCacheInterceptor executed.');
    const request = context.switchToHttp().getRequest();
    const url = request.url;

    if (this.cache.has(url)) {
      console.log('Its in the cache', url);
      return of(this.cache.get(url));
    }

    await new Promise(resolve => setTimeout(resolve, 3000));

    return next.handle().pipe(
      tap(data => {
        this.cache.set(url, data);
        console.log('Cached', url);
      }),
    );
  }
}
