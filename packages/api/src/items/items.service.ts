import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { GetItemsQueryDto } from './dto/get-items-query.dto';

@Injectable()
export class ItemsService {
  constructor(private prisma: PrismaService) {}

  async getItems(options: GetItemsQueryDto) {
    const where = {
      type: options.type,
    };

    const countItems = await this.prisma.items.count({
      where,
    });

    const items = await this.prisma.items.findMany({
      where,
      skip: options.skip,
      take: options.limit,
      select: {
        iconUrl: true,
        type: true,
        ability: { include: { effects: true } },
        id: true,
        name: true,
        rarity: true,
        prices: { include: { reporter: true } },
      },
      orderBy: {
        name: 'desc',
      },
    });

    return {
      max: countItems,
      items,
    };
  }

  async getItem(id: string) {
    const findItems = await this.prisma.items.findFirst({
      where: {
        id,
      },
      include: { ability: { include: { effects: true } } },
    });
    if (!findItems)
      throw new HttpException(
        'No Item found for this Id.',
        HttpStatus.NOT_FOUND,
      );
    return findItems;
  }
}
