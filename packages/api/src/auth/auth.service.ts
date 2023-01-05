import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { PrismaService } from 'src/prisma.service';
import { UsersService } from 'src/users/users.service';
import { promisify } from 'util';
import { fail } from '../utils';
const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private prisma: PrismaService,
  ) {}

  async signup(username: string, password: string) {
    const searchUserResult = await this.prisma.users.findFirst({
      where: { username: username },
    });
    if (searchUserResult)
      throw new HttpException(
        fail('58ee27a1-f431-4e6f-9656-666ed857d9bc'),
        HttpStatus.BAD_REQUEST,
      );
    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    const sultHash = salt + '.' + hash.toString('hex');
    const user = await this.usersService.create(username, sultHash);
    return user;
  }

  async signin(username: string, password: string) {
    const searchUserResult = await this.prisma.users.findFirst({
      where: { username: username },
    });
    if (!searchUserResult) {
      throw new NotFoundException('user not found');
    }

    const [salt, storedHash] = searchUserResult.password.split('.');
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('incorrept password');
    }

    return searchUserResult;
  }
}
