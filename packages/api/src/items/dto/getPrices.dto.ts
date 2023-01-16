import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class GetPricesDto {
  @ApiProperty({ enum: ['ability', 'weapon', 'armor'] })
  @IsEnum(['ability', 'weapon', 'armor'])
  @IsOptional()
  type: 'ability' | 'weapon' | 'armor';
}
