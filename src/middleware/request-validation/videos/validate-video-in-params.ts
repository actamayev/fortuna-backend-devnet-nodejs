import Joi from "joi"
import _ from "lodash"
import { Request, Response, NextFunction } from "express"

const videoIdInParamsSchema = Joi.object({
	videoId: Joi.number().strict().required()
}).required()

export default function validateVideoIdInParams (req: Request, res: Response, next: NextFunction): Response | void {
	try {
		const params = { videoId: Number(req.params.videoId) }

		const { error } = videoIdInParamsSchema.validate(params)

		if (!_.isUndefined(error)) return res.status(400).json({ validationError: error.details[0].message })

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to validate videoId in Params" })
	}
}
