import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Users } from '@catarks/db';

import { PrismaService } from '@/prisma.service';
import { GetItemsQueryDto } from '@/items/dto/get-items-query.dto';
import { GetItemPriceDtoQuery } from '@/items/dto/getItemPrice.dto';
import { createItemPriceDto } from '@/items/dto/createItemPrice.dto';
import { GetPricesDto } from './dto/getPrices.dto';

@Injectable()
export class ItemsService {
  constructor(private prisma: PrismaService) {}

  async getPrices({ type }: GetPricesDto) {
    return await this.prisma.itemPrices.findMany({
      where: {
        item: {
          type,
        },
      },
      include: { item: true, reporter: true },
    });
  }

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
