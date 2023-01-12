import { S3 } from 'aws-sdk';
import { toPng } from 'jdenticon';
import { InjectAwsService } from 'nest-aws-sdk';
import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { Users } from '@catarks/db';
import { PrismaService } from '@/prisma.service';
import { getRandomIntInclusive, fail } from '@/utils';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const crypto = require('crypto');

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    @InjectRedis() private redis: Redis,
    @InjectAwsService(S3) private readonly s3: S3,
  ) {}

  async findFromUsername(username: string) {
    return await this.prisma.users.findFirst({
      where: {
        username: username,
      },
    });
  }

  async findOne(userId: string) {
    const user = await this.prisma.users.findFirst({ where: { id: userId } });
    return user;
  }

  async create_integration_request(username: string) {
    const user = await this.prisma.users.findFirst({ where: { username } });
    if (user.discordId) {
      throw new HttpException(
        fail('639ebe9f-b8be-435c-a350-5802e1ad2687'),
        HttpStatus.BAD_REQUEST,
      );
    }
    const create_code = async () => {
      const code = getRandomIntInclusive(12345, 99999);
      const existsIntegrationCode = await this.redis.get(username);

      if (existsIntegrationCode) create_code();
      return code;
    };

    const key = `integration_request_${username}`;
    const alreadyCode = await this.redis.get(key);

    const code = alreadyCode ? Number(alreadyCode) : await create_code();
    if (!alreadyCode) {
      await this.redis.set(key, code);
      await this.redis.expire(key, 900);
    }
    return { code };
  }

  async create_avatar(username: string) {
    const hitAvatar = await this.prisma.defaultAvatars.findFirst({
      where: { username },
    });
    if (hitAvatar) return hitAvatar.url;
    const png = toPng(username, 200);

    return this.s3
      .upload({
        Bucket: 'ngs-market',
        Key: `*/users/avatar/${crypto.randomUUID()}.png`,
        Body: png,
      })
      .promise()
      .then(async (res) => {
        await this.prisma.defaultAvatars.create({
          data: {
            username,
            url: res.Location,
          },
        });
        return res.Location;
      });
  }

  async create(username: string, password: string): Promise<Users> {
    const avatar_url = await this.create_avatar(username);
    const createdUser = await this.prisma.users.create({
      data: {
        username,
        password,
        settings: {
          create: {},
        },
        avatarUrl: avatar_url,
      },
    });
    return createdUser;
  }
}
