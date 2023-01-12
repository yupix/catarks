import secureSession from '@fastify/secure-session';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from '@/app.module';
import { config } from '@catarks/shared';
import { ValidationPipe } from '@nestjs/common';
import { RemovePasswordInterceptor } from '@/remove-pass';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import fastifyMultipart from '@fastify/multipart';
import { SentryService } from '@ntegral/nestjs-sentry';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    { bufferLogs: true },
  );
  await app.register(secureSession, {
    secret: config.auth.secret,
    salt: config.auth.salt,
  });

  app.useStaticAssets({
    root: join(__dirname, '..', 'public'),
    prefix: '/public/',
  });

  app.setViewEngine({
    engine: {
      handlebars: require('handlebars'),
    },
    templates: join(__dirname, '..', 'views'),
  });

  const documentConfig = new DocumentBuilder()
    .setVersion('1.0')
    .addCookieAuth('session')
    .build();

  // const logger = app.get(Logger);
  app.useGlobalInterceptors(new RemovePasswordInterceptor());
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useLogger(SentryService.SentryServiceInstance());
  app.register(fastifyMultipart);
  app.setGlobalPrefix('api');
  const sentryService = app.get(SentryService);

  const document = SwaggerModule.createDocument(app, documentConfig);
  SwaggerModule.setup('doc', app, document);

  app.enableCors({
    origin: '*',
    allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept',
  });
  await app.listen(3000, '0.0.0.0');
  sentryService.log(`🚀 Start up 0.0.0.0:3000`);
  // logger.log(`🚀 Start up 0.0.0.0:3000`);
}
bootstrap();
