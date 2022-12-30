import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString, ValidateNested } from 'class-validator';

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
  @ApiProperty({ nullable: true })
  discordId?: string;
}

export class UserSettingsDto {
  @IsString()
  @ApiProperty()
  useDarkTheme: true;
}

export class MeDto {
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
  @ApiProperty({ nullable: true })
  discordId?: string;

  @ApiProperty({ type: [UserSettingsDto] })
  @ValidateNested()
  settings: UserSettingsDto;
}
