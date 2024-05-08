import { Request, Response } from "express"
import Hash from "../../classes/hash"

export default async function hashString(req: Request, res: Response): Promise<Response> {
	try {
		const string = req.body.stringToHash as string
		const hashedString = await Hash.hashCredentials(string)

		return res.status(200).json({ hashedString })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Hash string" })
	}
}
