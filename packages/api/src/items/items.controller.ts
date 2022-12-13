import { Controller, Get, Param, Query } from '@nestjs/common';
import { GetItemsQueryDto } from './dto/get-items-query.dto';
import { ItemsService } from './items.service';

@Controller('items')
export class ItemsController {
  constructor(private itemsService: ItemsService) {}

  @Get('/')
  async getItems(@Query() query: GetItemsQueryDto) {
    return await this.itemsService.getItems(query);
  }

  @Get('/:itemId')
  async getItem(@Param('itemId') itemId: string) {
    return await this.itemsService.getItem(itemId);
  }

  @Get('/:itemId/price')
  async getItemPrice(@Param('itemId') itemId: string) {}
}
