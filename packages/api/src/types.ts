import { IsString, IsUUID } from 'class-validator';
import { ERRORS } from './error';
import { ApiProperty } from '@nestjs/swagger';

export type ItemTypes = Array<'ability' | 'weapon'>;

export const CreateErrorDto = (id: string) => {
  class ErrorDto {
    @IsString()
    @ApiProperty({ example: id })
    id: string;

    @IsString()
    @ApiProperty({ example: 'failed' })
    type: 'failed';

    @IsString()
    @ApiProperty({ example: ERRORS.get(id).code })
    code: string;

    @IsString()
    @ApiProperty({ example: ERRORS.get(id).description })
    message: string;
  }
  return ErrorDto;
};
