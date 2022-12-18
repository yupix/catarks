import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsUUID } from 'class-validator';

export class createItemPriceDto {
  @ApiProperty()
  @IsUUID()
  itemId: string;

  @ApiProperty()
  @IsInt()
  @Type(() => Number)
  price: number;
}

export class CreatedItemPriceDto {
  @ApiProperty()
  @IsInt()
  price: number;
}
