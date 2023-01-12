import { Md5 } from 'ts-md5';
import { S3 } from 'aws-sdk';
import { InjectAwsService } from 'nest-aws-sdk';
import { Scope as SentryScope } from '@sentry/node';
import { BadRequestException, Injectable } from '@nestjs/common';

import { Users } from '@catarks/db';

import { fail } from '@/utils';
import { PrismaService } from '@/prisma.service';
import { PatchProfileDto } from '@/user/dto/patch-user.dto';
import { MemoryStorageFile } from '@blazity/nest-file-fastify';

const crypto = require('crypto');
const mime = require('mime-types');
@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    @InjectAwsService(S3) private readonly s3: S3,
  ) {}

  async uploadAvatar(file: MemoryStorageFile) {
    const fileExtension = mime.extension(file.mimetype);
    if (!['png', 'jpeg', 'gif'].includes(fileExtension))
      throw new BadRequestException(
        fail('967c9cb5-2189-4fd5-b2c3-b45a8e1f453f'),
      );
    const hash = new Md5().appendByteArray(file.buffer).end().toString();
    const findFile = await this.prisma.files.findFirst({
      where: {
        hash,
      },
    });
    if (findFile) return findFile.url;
    const filename = `${crypto.randomUUID()}.${fileExtension}`;
    return this.s3
      .upload({
        Bucket: 'ngs-market',
        Key: `*/users/avatar/${filename}`,
        Body: file.buffer,
      })
      .promise()
      .then(async (res) => {
        await this.prisma.files.create({
          data: {
            filename,
            url: res.Location,
            hash,
          },
        });
        return res.Location;
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
