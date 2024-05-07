import _ from "lodash"
import { PrismaClient } from "@prisma/client"
import SecretsManager from "./secrets-manager"

export default class PrismaClientClass {
	private static prismaClient?: PrismaClient

	private constructor() {
	}

	public static async getPrismaClient(): Promise<PrismaClient> {
		if (_.isUndefined(this.prismaClient)) {
			const databaseUrl = await SecretsManager.getInstance().getSecret("DATABASE_URL")
			this.prismaClient = new PrismaClient({
				datasources: {
					db: {
						url: databaseUrl
					}
				}
			})
		}
		return this.prismaClient
	}
}
