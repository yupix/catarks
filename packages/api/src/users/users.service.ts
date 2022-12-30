import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Users } from '@vent/db';
import { PrismaService } from 'src/prisma.service';
import { getRandomIntInclusive, fail } from 'src/utils';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    @InjectRedis() private redis: Redis,
  ) {}

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

  async create(username: string, password: string): Promise<Users> {
    const createdUser = await this.prisma.users.create({
      data: {
        username,
        password,
        settings: {
          create: {},
        },
      },
    });
    return createdUser;
  }
}
