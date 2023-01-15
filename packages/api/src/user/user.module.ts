import { Module } from '@nestjs/common';

import { UserController } from '@/user/user.controller';
import { UserService } from '@/user/user.service';
import { PrismaService } from '@/prisma.service';
import { UsersService } from '@/users/users.service';
import { BullModule } from '@nestjs/bull';
import { FileUploadProcessor } from './processors/upload.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'file-upload-queue',
    }),
  ],
  controllers: [UserController],
  providers: [UserService, PrismaService, UsersService, FileUploadProcessor],
})
export class UserModule {}
