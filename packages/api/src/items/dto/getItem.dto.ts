import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsInt, IsString, ValidateNested } from 'class-validator';
import { UserDto } from 'src/auth/dto/user.dto';
import { ItemTypes } from 'src/types';

export class AbilityEffectDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsBoolean()
  percent: boolean;

  @ApiProperty()
  @IsString()
  effect: string;
}

export class AbilityDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ type: [AbilityEffectDto] })
  @ValidateNested()
  effects: AbilityEffectDto[];
}

export class ItemPriceDto {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsInt()
  price: number;

  @ApiProperty()
  @IsInt()
  ship: number;

  @ApiProperty({ type: UserDto })
  @ValidateNested()
  reporter: UserDto;

  @ApiProperty()
  @IsString()
  reporterId: string;
}

export class DropAriaDto {
  @IsString()
  @ApiProperty()
  name: string;
}

export class ItemDto {
  @ApiProperty({ enum: ['ability', 'weapon'] })
  type: ItemTypes;

  @ApiProperty()
  @ValidateNested()
  ability?: AbilityDto;

  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsInt()
  rarity: number;

  @ApiProperty()
  @IsString()
  iconUrl: string;

  @ApiProperty()
  @ValidateNested()
  prices: ItemPriceDto[];

  @ApiProperty()
  @ValidateNested()
  droparias: DropAriaDto[];
}

export class getItemsDto {
  @IsInt()
  @ApiProperty()
  max: number;

  @ApiProperty({ type: [ItemDto] })
  @ValidateNested()
  items: ItemDto[];
}
