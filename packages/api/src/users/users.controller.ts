import {
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Users } from '@vent/db';
import { AuthGuard } from '../auth.guard';
import { CurrentUser } from '../current-user.decorator';
import { CurrentUserInterceptor } from '../current-user.interceptor';
import { UsersService } from './users.service';
import { IntegrationRequestDto } from './dto/createIntegration.dto';
import { ApiCreatedResponse } from '@nestjs/swagger';

@UseInterceptors(CurrentUserInterceptor)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  @Get('/whoami')
  @UseGuards(AuthGuard)
  whoAmi(@CurrentUser() user: Users) {
    return user;
  }

  @Get('/:userId')
  async getProfile(@Param('userId') userId: string) {
    return await this.usersService.findOne(userId);
  }

  @Post('/integration/discord')
  @ApiCreatedResponse({ type: IntegrationRequestDto })
  @UseGuards(AuthGuard)
  async IntegrationRequest(@CurrentUser() user: Users) {
    return await this.usersService.create_integration_request(user.id);
  }
}
