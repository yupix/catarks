import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { GetItemsQueryDto } from './dto/get-items-query.dto';
import { ItemsService } from './items.service';
import {
  CreatedItemPriceDto,
  createItemPriceDto,
} from './dto/createItemPrice.dto';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { ItemDto, getItemsDto } from './dto/getItem.dto';
import { getItemPriceDto } from './dto/getItemPrice.dto';

@Controller('items')
export class ItemsController {
  constructor(private itemsService: ItemsService) {}

  @Get('/')
  @ApiOkResponse({ type: getItemsDto })
  async getItems(@Query() query: GetItemsQueryDto) {
    return await this.itemsService.getItems(query);
  }

  @Get('/:itemId')
  @ApiOkResponse({ type: ItemDto })
  async getItem(@Param('itemId') itemId: string) {
    return await this.itemsService.getItem(itemId);
  }

  @Get('/:itemId/price')
  @ApiOkResponse({ type: getItemPriceDto, isArray: true })
  async getItemPrice(@Param('itemId') itemId: string) {
    return await this.itemsService.getItemPrice(itemId);
  }

  @Post('/:itemId/price')
  @ApiCreatedResponse({ type: CreatedItemPriceDto })
  async createItemPrice(
    @Param('itemId') itemId: string,
    @Body() body: createItemPriceDto,
  ) {}
}
