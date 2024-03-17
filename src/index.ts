import cors from "cors"
import dotenv from "dotenv"
import express from "express"
import { createServer } from "http"
import cookieParser from "cookie-parser"

import authRoutes from "./routes/auth-routes"

import checkHealth from "./controllers/health-checks/check-health"

dotenv.config()

const port = parseInt(process.env.PORT, 10) || 8000

// void connectDatabase()

const app = express()

const server = createServer(app)


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

app.use("/auth", authRoutes)

app.use("/health", checkHealth)

app.use("*", (req, res) => res.status(404).json({ error: "Route not found"}))

// Initialization of server:
server.listen(port, "0.0.0.0", () => {
	console.info(`Listening on port ${port}`)
})
