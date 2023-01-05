import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export const ERRORS = new Map<
  string,
  {
    description: string;
    code: string;
  }
>([
  [
    '58ee27a1-f431-4e6f-9656-666ed857d9bc',
    {
      description: '既に利用されているユーザー名です',
      code: 'ALREADY_USED_USERNAME',
    },
  ],
  [
    '639ebe9f-b8be-435c-a350-5802e1ad2687',
    {
      description: '既にDiscordと連携済みです',
      code: 'ALREADY_CONNECTED_TO_DISCORD',
    },
  ],
]);

export class ALREADY_USED_USERNAME_ERROR {
  @IsString()
  @ApiProperty({ example: '58ee27a1-f431-4e6f-9656-666ed857d9bc' })
  id: string;

  @IsString()
  @ApiProperty({ example: 'failed' })
  type: 'failed';

  @IsString()
  @ApiProperty({ example: 'ALREADY_USED_USERNAME' })
  code: string;

  @IsString()
  @ApiProperty({ example: '既に利用されているユーザー名です' })
  message: string;
}

export class ALREADY_CONNECTED_TO_DISCORD_ERROR {
  @IsString()
  @ApiProperty({ example: '639ebe9f-b8be-435c-a350-5802e1ad2687' })
  id: string;

  @IsString()
  @ApiProperty({ example: 'failed' })
  type: 'failed';

  @IsString()
  @ApiProperty({ example: 'ALREADY_CONNECTED_TO_DISCORD' })
  code: string;

  @IsString()
  @ApiProperty({ example: '既にDiscordと連携済みです' })
  message: string;
}
