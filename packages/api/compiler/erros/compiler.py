import json
from typing import Tuple, TypedDict


class IErrorContent(TypedDict):
    description: str
    code: str


with open('./error.json', mode='r', encoding='utf-8') as f:
    error_enum = ''
    errors: list[Tuple[str, IErrorContent]] = json.load(f)
    text = f'''import {{ ApiProperty }} from '@nestjs/swagger';
import {{ IsString }} from 'class-validator';

export const ERRORS = new Map<
      string,
      {{
        description: string;
        code: string;
      }}
    >({errors})\n
'''
    for i in errors:
        error_id = i[0]
        text += f'''export class {i[1]["code"]}_ERROR {{
  @IsString()
  @ApiProperty({{ example: '{error_id}', default: '{error_id}' }})
  id: string;

  @IsString()
  @ApiProperty({{ example: 'failed' }})
  type: 'failed';

  @IsString()
  @ApiProperty({{ example: '{i[1]["code"]}', default: '{i[1]["code"]}' }})
  code: string;

  @IsString()
  @ApiProperty({{ example: '{i[1]["description"]}', default: '{i[1]["description"]}' }})
  message: string;
}}\n
'''

    with open('../../src/error.ts', mode='w', encoding='utf-8') as writef:
        writef.write(text)

