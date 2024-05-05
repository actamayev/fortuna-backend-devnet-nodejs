import cors from "cors"
import dotenv from "dotenv"
import express from "express"
import cookieParser from "cookie-parser"

import checkHealth from "./controllers/health-checks/check-health"
import jwtVerify from "./middleware/jwt/jwt-verify"

import searchRoutes from "./routes/search-routes"
import solanaRoutes from "./routes/solana-routes"
import uploadRoutes from "./routes/upload-routes"
import videosRoutes from "./routes/videos-routes"
import authRoutes from "./routes/auth/auth-routes"
import youtubeRoutes from "./routes/youtube-routes"
import personalInfoRoutes from "./routes/personal-info-routes"

dotenv.config({ path: process.env.NODE_ENV === "production" ? ".env.production" : ".env.local" })

const port = parseInt(process.env.PORT, 10) || 8000

const app = express()

const allowedOrigins = [
	"https://www.mintfortuna.com", "https://mintfortuna.com",
	"https://devnet.mintfortuna.com",
	"http://localhost:3000"
]

app.use(cors({
	origin: function (origin, callback) {
		// Allow requests with no origin (like mobile apps, curl requests, or Postman)
		if (!origin) return callback(null, true)
		if (allowedOrigins.indexOf(origin) === -1) {
			const msg = "The CORS policy for this site does not allow access from the specified Origin."
			return callback(new Error(msg), false)
		}
		return callback(null, true)
	},
	methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
	allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
	credentials: true
}))

app.use(cookieParser())
app.use(express.json())

app.use("/auth", authRoutes)
app.use("/personal-info", jwtVerify, personalInfoRoutes)
app.use("/search", searchRoutes)
app.use("/solana", solanaRoutes)
app.use("/upload", jwtVerify, uploadRoutes)
app.use("/videos", videosRoutes)
app.use("/youtube", jwtVerify, youtubeRoutes)

app.use("/health", checkHealth)

app.use("*", (req, res) => res.status(404).json({ error: "Route not found"}))

// Initialization of server:
app.listen(port, "0.0.0.0", () => {
	console.info(`Listening on port ${port}`)
})
