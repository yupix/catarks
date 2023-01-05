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
import { GetItemsQueryDto } from './dto/get-items-query.dto';
import { ItemsService } from './items.service';
import {
  CreatedItemPriceDto,
  createItemPriceDto,
} from './dto/createItemPrice.dto';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { ItemDto, getItemsDto } from './dto/getItem.dto';
import { GetItemPriceDto, getItemPriceDto } from './dto/getItemPrice.dto';
import { CurrentUserInterceptor } from 'src/current-user.interceptor';
import { AuthGuard } from 'src/auth.guard';
import { CurrentUser } from 'src/current-user.decorator';
import { Users } from '@catarks/db';

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
    @Param('itemId') itemId: string,
    @Query() query: GetItemPriceDto,
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
