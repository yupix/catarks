import { Body, Controller, HttpCode, Post, Req, Session } from '@nestjs/common';
import { AuthService } from '@/auth/auth.service';
import { CreateUserDto } from '@/auth/dto/create-user.dto';
import * as secureSession from '@fastify/secure-session';
import { ApiBadRequestResponse, ApiCreatedResponse } from '@nestjs/swagger';
import { MeDto, UserDto } from '@/auth/dto/user.dto';
import { ALREADY_USED_USERNAME_ERROR } from '@/error';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('/signup')
  @ApiCreatedResponse({ type: UserDto })
  @ApiBadRequestResponse({
    type: ALREADY_USED_USERNAME_ERROR,
  })
  async signup(
    @Session() session: secureSession.Session,
    @Body() body: CreateUserDto,
  ) {
    const user = await this.authService.signup(body.username, body.password);
    session.set('userId', user.id);
    return user;
  }

  @Post('/signin')
  @ApiCreatedResponse({ type: MeDto })
  async signin(
    @Session() session: secureSession.Session,
    @Body() body: CreateUserDto,
  ) {
    const user = await this.authService.signin(body.username, body.password);
    session.set('userId', user.id);
    return user;
  }

  @Post('/signout')
  @HttpCode(201)
  async signout(@Session() session: secureSession.Session) {
    session.delete();
  }
}
