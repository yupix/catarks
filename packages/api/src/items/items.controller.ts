import { Controller, Get, Param } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ItemsService } from './items.service';

@Controller('items')
export class ItemsController {
    constructor(
        private itemsService: ItemsService
    ){}

    @Get('/')
    async getItems() {
        return await this.itemsService.getItems()
    }

    @Get('/:itemId')
    async getItem(@Param('itemId') itemId: string) {
        return await this.itemsService.getItem(itemId)
    }

    @Get('/:itemId/price')
    async getItemPrice(@Param('itemId') itemId: string) {
        
    }
}
