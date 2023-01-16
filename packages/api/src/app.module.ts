import { HttpException, Module } from '@nestjs/common';
import { AwsSdkModule } from 'nest-aws-sdk';
import { S3 } from 'aws-sdk';
import { RedisModule } from '@nestjs-modules/ioredis';
import {
  SentryInterceptor,
  SentryModule,
  SentryService,
} from '@ntegral/nestjs-sentry';
import { LoggerModule } from 'nestjs-pino';

import { config } from '@catarks/shared';

import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { ItemsModule } from '@/items/items.module';
import { AuthModule } from '@/auth/auth.module';
import { UsersModule } from '@/users/users.module';
import { UserModule } from '@/user/user.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { Scope } from '@sentry/node';
import { BullModule } from '@nestjs/bull';
import { QueuesModule } from './queues/queues.module';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: config.redis.host,
        port: config.redis.port,
        password: config.redis.password,
        db: config.redis.db,
      },
    }),
    SentryModule.forRoot({
      dsn: `${config.api.sentry.ssl ? 'https' : 'http'}://${
        config.api.sentry.token
      }@${config.api.sentry.domain}/${config.api.sentry.projectId}`,
      debug: false,
      environment: 'dev',
      release: null,
      logLevels: ['debug'],
      close: {
        enabled: true,
        timeout: 100,
      },
    }),
    AwsSdkModule.forRoot({
      defaultServiceOptions: {
        region: 'us-east-1',
        endpoint: config.objectStorage.endpoint,
        s3ForcePathStyle: true,
        credentials: {
          secretAccessKey: config.objectStorage.secretAccessKey,
          accessKeyId: config.objectStorage.accessKeyId,
        },
      },
      services: [S3],
    }),
    LoggerModule.forRoot({}),
    RedisModule.forRoot({
      config: {
        port: config.redis.port,
        host: config.redis.host,
        password: config.redis.password,
        db: config.redis.db,
      },
    }),
    ItemsModule,
    AuthModule,
    UsersModule,
    UserModule,
    BullModule,
    QueuesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useFactory: (sentry: SentryService) =>
        new SentryInterceptor({
          filters: [
            {
              type: HttpException,
              filter: (exception: HttpException) => {
                const scope = new Scope();
                sentry.instance().captureException(exception, () => scope);
                return true;
              },
            },
          ],
        }),
      inject: [SentryService],
    },
  ],
})
export class AppModule {}
