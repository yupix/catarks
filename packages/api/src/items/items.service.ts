import { Get, Injectable, Param, Post } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ItemsService {
    constructor(
        private prisma: PrismaService
    ) {}

    async getItem(id: string) {
        return await this.prisma.items.findFirst({where: {
            id
        }, include: {ability: {include:{effects: true}}}})
    }
}
