import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ItemsController } from './items.controller';
import { ItemsService } from './items.service';
import { UsersService } from 'src/users/users.service';

@Module({
  controllers: [ItemsController],
  providers: [ItemsService, PrismaService, UsersService],
})
export class ItemsModule {}
