import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { GetItemsQueryDto } from './dto/get-items-query.dto';
import { createItemPriceDto } from './dto/createItemPrice.dto';
import { Users } from '@catarks/db';
import { GetItemPriceDtoQuery } from './dto/getItemPrice.dto';

@Injectable()
export class ItemsService {
  constructor(private prisma: PrismaService) {}

  async createItemPrice({
    itemId,
    price,
    ship,
    user,
  }: { user: Users; itemId: string } & createItemPriceDto) {
    return await this.prisma.itemPrices.create({
      data: {
        price: price,
        ship,
        item: { connect: { id: itemId } },
        reporter: { connect: { id: user.id } },
      },
      include: { reporter: true },
    });
  }

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
        droparias: true,
      },
      orderBy: {
        name: 'desc',
      },
    });

    return {
      max: countItems,
      items: items,
    };
  }

  async getItemPrice(id: string, query: GetItemPriceDtoQuery) {
    const findPrices = await this.prisma.itemPrices.findMany({
      where: {
        itemId: id,
      },
      include: { reporter: true },
      orderBy: {
        createdAt: query.sort,
      },
      take: query.limit,
    });
    return findPrices;
  }

  async getItem(id: string) {
    const findItems = await this.prisma.items.findFirst({
      where: {
        id,
      },
      include: { ability: { include: { effects: true } }, droparias: true },
    });
    if (!findItems)
      throw new HttpException(
        'No Item found for this Id.',
        HttpStatus.NOT_FOUND,
      );
    return findItems;
  }
}
