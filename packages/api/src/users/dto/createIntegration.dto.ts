import { IsString } from 'class-validator';

export class IntegrationRequestDto {
  @IsString()
  code: string;
}
