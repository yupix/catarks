import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsInt,
  IsString,
  ValidateNested,
} from 'class-validator';

export class UserDto {
  @IsString()
  @IsBoolean()
  @ApiProperty()
  id: string;

  @IsString()
  @ApiProperty()
  username: string;

  @IsString()
  @ApiProperty()
  avatarUrl: string;

  @IsString()
  @ApiProperty()
  description: string;

  @IsString()
  @ApiProperty({ nullable: true })
  discordId?: string;

  @IsInt()
  @ApiProperty()
  ship: number;

  @IsString()
  @ApiProperty({ nullable: true })
  bannerUrl: string;

  @IsDate()
  @Type(() => Date)
  createdAt: Date;
}

export class UserSettingsDto {
  @IsString()
  @ApiProperty()
  useDarkTheme: true;
}

export class MeDto extends UserDto {
  @ApiProperty({ type: UserSettingsDto })
  @ValidateNested()
  settings: UserSettingsDto;
}
