import {
  Body,
  Controller,
  HttpCode,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '../auth.guard';
import { CurrentUserInterceptor } from '../current-user.interceptor';
import { UserService } from './user.service';
import { PatchProfileDto } from './dto/patch-user.dto';
import { CurrentUser } from '../current-user.decorator';
import { Users } from '@catarks/db';
import { ApiCookieAuth, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { UserDto } from '../auth/dto/user.dto';
import {
  FileInterceptor,
  MemoryStorageFile,
  UploadedFile,
} from '@blazity/nest-file-fastify';

@UseInterceptors(CurrentUserInterceptor)
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  @Post('avatar')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(@UploadedFile() file: MemoryStorageFile) {
    return await this.userService.uploadAvatar(file);
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
