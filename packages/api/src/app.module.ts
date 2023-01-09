import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ItemsModule } from './items/items.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RedisModule } from '@nestjs-modules/ioredis';
import { config } from '@catarks/shared';
import { AwsSdkModule } from 'nest-aws-sdk';
import { S3 } from 'aws-sdk';
import { UserModule } from './user/user.module';

@Module({
  imports: [
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
    RedisModule.forRoot({
      config: {
        port: config.redis.port,
        host: config.redis.host,
        password: config.redis.password,
        db: config.redis.db,
      },
    }),
    ItemsModule,
    LoggerModule.forRoot({
      pinoHttp: { transport: { target: 'pino-pretty' } },
    }),
    AuthModule,
    UsersModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
