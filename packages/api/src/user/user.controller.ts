import {
  Body,
  Controller,
  Patch,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '../auth.guard';
import { CurrentUserInterceptor } from '../current-user.interceptor';
import { UserService } from './user.service';
import { PatchProfileDto } from './dto/patch-user.dto';
import { CurrentUser } from '../current-user.decorator';
import { Users } from '@catarks/db';
import { ApiCreatedResponse } from '@nestjs/swagger';
import { UserDto } from '../auth/dto/user.dto';

@UseInterceptors(CurrentUserInterceptor)
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  @Patch('')
  @UseGuards(AuthGuard)
  @ApiCreatedResponse({ type: UserDto })
  async PathProfile(@CurrentUser() user: Users, @Body() body: PatchProfileDto) {
    return await this.userService.patchProfile(user, body);
  }
}
