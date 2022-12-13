import {
  Get,
  HttpException,
  HttpStatus,
  Injectable,
  Param,
  Post,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { GetItemsQueryDto } from './dto/get-items-query.dto';

@Injectable()
export class ItemsService {
  constructor(private prisma: PrismaService) {}

  async getItems(options: GetItemsQueryDto) {
    return await this.prisma.items.findMany({ where: options });
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
