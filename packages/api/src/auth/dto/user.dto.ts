import { IsBoolean, IsString } from 'class-validator';

export class UserDto {
  @IsString()
  id: string;

  @IsString()
  username: string;

  @IsString()
  avatarUrl: string;

  @IsBoolean()
  useDarkTheme: boolean;
}
