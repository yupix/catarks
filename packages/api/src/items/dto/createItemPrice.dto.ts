import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, Max, Min } from 'class-validator';

export class createItemPriceDto {
  @ApiProperty()
  @IsInt()
  @Max(99999999999)
  @Min(1000)
  @Type(() => Number)
  price: number;

  @ApiProperty()
  @IsInt()
  @Max(10)
  @Min(1)
  @Type(() => Number)
  ship: number;
}

export class CreatedItemPriceDto {
  @ApiProperty()
  @IsInt()
  price: number;
}
