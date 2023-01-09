import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ShipTypes } from 'src/types';

export class PatchProfileDto {
  @ApiProperty({
    description: 'メインで使用するship番号',
    example: 8,
    enum: [...ShipTypes],
  })
  @IsOptional()
  @IsEnum([...ShipTypes])
  ship?: number;

  @ApiProperty({ description: 'バナーのURL' })
  @IsOptional()
  @IsString()
  bannerUrl?: string;

  @ApiProperty({ description: 'アバターのURL' })
  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @ApiProperty({ description: '自己紹介' })
  @IsOptional()
  @IsString()
  description?: string;
}
