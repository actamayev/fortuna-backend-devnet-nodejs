import { Request, Response } from "express"

export default function logout (req: Request, res: Response): Response {
	try {
		return res.status(200).json({ success: "Logout successful" })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Logout" })
	}
}
