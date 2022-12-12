import secureSession from "@fastify/secure-session";
import { NestFactory } from "@nestjs/core";
import {
	FastifyAdapter,
	NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { Logger } from "nestjs-pino";
import { AppModule } from "./app.module";
import { config } from "@vent/shared"
import { ValidationPipe } from "@nestjs/common";
import { RemovePasswordInterceptor } from "./remove-pass";

async function bootstrap() {
	const app = await NestFactory.create<NestFastifyApplication>(
		AppModule,
		new FastifyAdapter(),
		{ bufferLogs: true },
	);
	await app.register(secureSession, {
		secret: config.auth.secret,
		salt: config.auth.salt
	})
	const logger = app.get(Logger)
	app.useGlobalInterceptors(new RemovePasswordInterceptor())
	app.useGlobalPipes(new ValidationPipe())
	app.useLogger(logger);
	app.setGlobalPrefix("api");
	await app.listen(3000, "0.0.0.0");
	logger.log(`🚀 Start up 0.0.0.0:3000`)
}
bootstrap();
