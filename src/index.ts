import cors from "cors"
import dotenv from "dotenv"
import express from "express"
import cookieParser from "cookie-parser"

import devnetRoutes from "./routes/devnet/devnet-routes"

import checkHealth from "./controllers/health-checks/check-health"

dotenv.config({ path: process.env.NODE_ENV === "production" ? ".env.production" : ".env.local" })

const port = parseInt(process.env.PORT, 10) || 8000

const app = express()

app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", req.headers.origin as string)
	res.header("Access-Control-Allow-Credentials", "true")
	next()
})

app.use(cors({
	credentials: true,
	origin: (origin, callback) => {
		callback(null, true)
	}
}))

app.use(cookieParser())
app.use(express.json())

app.use("/devnet", devnetRoutes)

app.use("/health", checkHealth)

app.use("*", (req, res) => res.status(404).json({ error: "Route not found"}))

// Initialization of server:
app.listen(port, "0.0.0.0", () => {
	console.info(`Listening on port ${port}`)
})
