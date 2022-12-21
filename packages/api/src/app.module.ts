import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ItemsModule } from './items/items.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RedisModule } from '@nestjs-modules/ioredis';
import { config } from '@vent/shared';

@Module({
  imports: [
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
