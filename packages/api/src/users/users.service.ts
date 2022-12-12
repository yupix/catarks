import { Injectable } from "@nestjs/common";
import { Users } from "@vent/db";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class UsersService {
	constructor(private prisma: PrismaService) {}

	async findOne(userId: string) {
		const user = await this.prisma.users.findFirst({ where: { id: userId } });
		return user;
	}

	async create(username: string, password: string): Promise<Users> {
		const createdUser = await this.prisma.users.create({
			data: {
				username,
				password,
			},
		});
		return createdUser;
	}
}
