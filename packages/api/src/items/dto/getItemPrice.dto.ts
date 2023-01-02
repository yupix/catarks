import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNumber, IsString, ValidateNested } from 'class-validator';
import { UserDto } from 'src/auth/dto/user.dto';

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
