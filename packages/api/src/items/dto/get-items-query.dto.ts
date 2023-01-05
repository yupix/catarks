import { ItemTypes } from '@catarks/db';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class GetItemsQueryDto {
  @ApiProperty({ enum: ['ability', 'weapon', 'armor'] })
  @IsEnum(['ability', 'weapon', 'armor'])
  @IsOptional()
  type?: 'ability' | 'weapon' | 'armor';

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  skip?: number;

  @ApiProperty()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;
}
