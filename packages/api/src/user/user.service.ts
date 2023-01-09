import { Injectable } from '@nestjs/common';
import { PatchProfileDto } from './dto/patch-user.dto';
import { PrismaService } from '../prisma.service';
import { Users } from '@catarks/db';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
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
