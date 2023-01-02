import {
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Users } from '@catarks/db';
import { AuthGuard } from '../auth.guard';
import { CurrentUser } from '../current-user.decorator';
import { CurrentUserInterceptor } from '../current-user.interceptor';
import { UsersService } from './users.service';
import { IntegrationRequestDto } from './dto/createIntegration.dto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { CreateErrorDto } from 'src/types';
import { MeDto } from 'src/auth/dto/user.dto';

@UseInterceptors(CurrentUserInterceptor)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  @Get('/whoami')
  @UseGuards(AuthGuard)
  @ApiOkResponse({ type: MeDto })
  whoAmi(@CurrentUser() user: Users) {
    return user;
  }

  @Get('/:userId')
  async getProfile(@Param('userId') userId: string) {
    return await this.usersService.findOne(userId);
  }

  @Post('/integration/discord')
  @ApiCreatedResponse({ type: IntegrationRequestDto })
  @ApiBadRequestResponse({
    type: CreateErrorDto('639ebe9f-b8be-435c-a350-5802e1ad2687'),
  })
  @UseGuards(AuthGuard)
  async IntegrationRequest(@CurrentUser() user: Users) {
    return await this.usersService.create_integration_request(user.username);
  }
}
