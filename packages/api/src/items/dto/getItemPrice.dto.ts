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
import { UserDto } from 'src/auth/dto/user.dto';

export class GetItemPriceDto {
  @ApiProperty()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  limit?: number;

  @ApiProperty({ nullable: true })
  @IsOptional()
  @IsEnum(['desc', 'asc'])
  sort?: 'desc' | 'asc' = 'desc';
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
