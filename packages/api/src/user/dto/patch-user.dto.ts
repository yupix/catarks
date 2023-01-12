import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { ShipTypes } from '@catarks/shared';

export class PatchProfileDto {
  @ApiProperty({
    description: 'メインで使用するship番号',
    example: 8,
    enum: [...ShipTypes],
    nullable: true,
  })
  @ApiProperty({
    nullable: true,
  })
  @IsOptional()
  @IsEnum([...ShipTypes])
  @IsInt()
  ship?: number;

  @ApiProperty({ description: 'バナーのURL', nullable: true })
  @IsOptional()
  @IsString()
  bannerUrl?: string;

  @ApiProperty({ description: 'アバターのURL', nullable: true })
  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @ApiProperty({ description: '自己紹介', nullable: true })
  @IsOptional()
  @IsString()
  description?: string;
}
