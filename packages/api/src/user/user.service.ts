import { S3 } from 'aws-sdk';
import { InjectAwsService } from 'nest-aws-sdk';
import { BadRequestException, Injectable } from '@nestjs/common';

import { Users } from '@catarks/db';

import { fail } from '@/utils';
import { PrismaService } from '@/prisma.service';
import { PatchProfileDto } from '@/user/dto/patch-user.dto';
import { MemoryStorageFile } from '@blazity/nest-file-fastify';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { queuePool } from '@/bull-board-queue';

const crypto = require('crypto');
const mime = require('mime-types');
@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    @InjectAwsService(S3) private readonly s3: S3,
    @InjectQueue('file-upload-queue') private fileQueue: Queue,
  ) {
    queuePool.add(fileQueue);
  }

  async uploadAvatar(file: MemoryStorageFile, user: Users) {
    const fileExtension = mime.extension(file.mimetype);
    if (!['png', 'jpeg', 'gif'].includes(fileExtension))
      throw new BadRequestException(
        fail('967c9cb5-2189-4fd5-b2c3-b45a8e1f453f'),
      );
    await this.fileQueue.add('file-upload-job', {
      file,
      path: '*/users/avatar',
      user,
    });
  }

  async patchProfile(user: Users, body: PatchProfileDto) {
    return await this.prisma.users.update({
      where: { id: user.id },
      data: {
        avatarUrl: body.avatarUrl,
        bannerUrl: body.bannerUrl,
        ship: body.ship,
        description: body.description,
      },
    });
  }
}
