import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';

import { Users } from '@catarks/db';

import {
  GetItemPriceDtoQuery,
  getItemPriceDto,
} from '@/items/dto/getItemPrice.dto';
import {
  CreatedItemPriceDto,
  createItemPriceDto,
} from '@/items/dto/createItemPrice.dto';
import { AuthGuard } from '@/auth.guard';
import { ItemsService } from '@/items/items.service';
import { CurrentUser } from '@/current-user.decorator';
import { ItemDto, getItemsDto } from '@/items/dto/getItem.dto';
import { GetItemsQueryDto } from '@/items/dto/get-items-query.dto';
import { CurrentUserInterceptor } from '@/current-user.interceptor';

@Controller('items')
@UseInterceptors(CurrentUserInterceptor)
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
  async getItemPrice(
    @Query() query: GetItemPriceDtoQuery,
    @Param('itemId') itemId: string,
  ) {
    return await this.itemsService.getItemPrice(itemId, query);
  }

  @Post('/:itemId/price')
  @ApiCreatedResponse({ type: CreatedItemPriceDto })
  @UseGuards(AuthGuard)
  async createItemPrice(
    @Param('itemId') itemId: string,
    @CurrentUser() user: Users,
    @Body() body: createItemPriceDto,
  ) {
    return await this.itemsService.createItemPrice({ itemId, user, ...body });
  }
}
