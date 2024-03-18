import prismaClient from "../../../prisma-client"

export default async function doesUserHaveSolanaWallet(userId: number): Promise<boolean> {
	const solanaWalletRecord = await prismaClient.solanaWallet.findFirst({
		where: { userId },
	})
	return solanaWalletRecord !== null
}
