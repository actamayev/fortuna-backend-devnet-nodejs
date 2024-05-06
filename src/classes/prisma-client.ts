import _ from "lodash"
import { PrismaClient } from "@prisma/client"
import SecretsManager from "./secrets-manager"

export default class PrismaClientClass {
	private static instance: PrismaClientClass | null = null
	private prismaClient?: PrismaClient
	private databaseUrl: string | null = null

	private constructor() {
		void this.initializePrismaClient()
	}

	public static getInstance(): PrismaClientClass {
		if (_.isNull(PrismaClientClass.instance)) {
			PrismaClientClass.instance = new PrismaClientClass()
		}
		return PrismaClientClass.instance
	}

	private async initializePrismaClient(): Promise<void> {
		if (_.isNull(this.databaseUrl)) {
			this.databaseUrl = await SecretsManager.getInstance().getSecret("DATABASE_URL")
		}
		this.prismaClient = new PrismaClient({
			datasources: {
				db: {
					url: this.databaseUrl
				}
			}
		})
	}

	public async getPrismaClient(): Promise<PrismaClient> {
		if (_.isUndefined(this.prismaClient)) {
			await this.initializePrismaClient()
		}
		return this.prismaClient as PrismaClient
	}
}
