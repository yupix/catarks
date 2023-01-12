import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectSentry, SentryService } from '@ntegral/nestjs-sentry';
import { Scope } from '@sentry/node';
import { fail } from '../utils';

@Injectable()
export class LoggerService {
  constructor(@InjectSentry() private readonly sentry: SentryService) {}
  getNestException(status: HttpStatus) {
    switch (status) {
      case HttpStatus.BAD_REQUEST:
        return BadRequestException;
    }
  }

  async sendExceptionToSentry<T extends Error>(
    exception: T,
    body: ReturnType<typeof fail>,
    scope: Scope,
  ) {
    this.sentry.instance().captureException(exception, () => scope);
  }
}
