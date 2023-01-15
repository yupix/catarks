import {
  Body,
  Controller,
  HttpCode,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  FileInterceptor,
  MemoryStorageFile,
  UploadedFile,
} from '@blazity/nest-file-fastify';
import { ApiCookieAuth, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';

import { Users } from '@catarks/db';

import { AuthGuard } from '@/auth.guard';
import { UserDto } from '@/auth/dto/user.dto';
import { UserService } from '@/user/user.service';
import { CurrentUser } from '@/current-user.decorator';
import { PatchProfileDto } from '@/user/dto/patch-user.dto';
import { CurrentUserInterceptor } from '@/current-user.interceptor';

@UseInterceptors(CurrentUserInterceptor)
@UseGuards(AuthGuard)
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  @Post('avatar')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(
    @CurrentUser() user: Users,
    @UploadedFile() file: MemoryStorageFile,
  ) {
    console.log(user);
    return await this.userService.uploadAvatar(file, user);
  }

  @Patch('')
  @UseGuards(AuthGuard)
  @ApiCookieAuth()
  @ApiTags('user')
  @ApiCreatedResponse({ type: UserDto })
  @HttpCode(201)
  async PathProfile(@CurrentUser() user: Users, @Body() body: PatchProfileDto) {
    return await this.userService.patchProfile(user, body);
  }
}
