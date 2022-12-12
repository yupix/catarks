import { PrismaClient } from "@vent/db";

export class ORM {
	private static _instance: PrismaClient;
	private constructor() {}

	public static instance(): PrismaClient {
		if (!this._instance) {
			this._instance = new PrismaClient();
			return this._instance;
		}
		return this._instance;
	}
}
