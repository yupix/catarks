import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

const removePassword = (data: any) => {
  if (Array.isArray(data)) {
    for (const i of data) {
      removePassword(i);
    }
  }
  if (typeof data === 'object') {
    if (data === null) return;
    for (const key of Object.keys(data)) {
      if (Array.isArray(data[key]) || typeof data[key] === 'object') {
        removePassword(data[key]);
      }
      if (key === 'password') {
        data[key] = undefined;
      }
    }
  }
};

@Injectable()
export class RemovePasswordInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map((value) => {
        if (Array.isArray(value)) {
          removePassword(value);
        }
        if (value?.password) {
          value.password = undefined;
        }
        return value;
      }),
    );
  }
}
