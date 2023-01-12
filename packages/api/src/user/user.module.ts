import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from '../prisma.service';
import { UsersService } from '../users/users.service';
import { LoggerService } from 'src/logger/logger.service';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService, UsersService, LoggerService],
})
export class UserModule {}
