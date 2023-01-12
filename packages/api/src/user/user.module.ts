import { Module } from '@nestjs/common';

import { UserController } from '@/user/user.controller';
import { UserService } from '@/user/user.service';
import { PrismaService } from '@/prisma.service';
import { UsersService } from '@/users/users.service';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService, UsersService],
})
export class UserModule {}
