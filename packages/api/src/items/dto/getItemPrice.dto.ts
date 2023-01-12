import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { UserDto } from '@/auth/dto/user.dto';

export type SortTypes = 'desc' | 'asc';

export class GetItemPriceDtoQuery {
  @ApiProperty()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  limit?: number;

  @ApiProperty({ enum: ['desc', 'asc'] })
  @IsEnum(['desc', 'asc'])
  @IsOptional()
  sort?: SortTypes = 'asc';
}

export class getItemPriceDto {
  @IsString()
  id: string;

  @IsNumber()
  price: number;

  @IsString()
  reporterId: string;

  @ApiProperty({ type: UserDto })
  @ValidateNested()
  reporter: UserDto;

  @IsDate()
  @Type(() => Date)
  createdAt: Date;
}
