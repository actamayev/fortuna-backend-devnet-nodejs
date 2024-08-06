import cors from "cors"
import dotenv from "dotenv"
import express from "express"
import cookieParser from "cookie-parser"

import allowedOrigins from "./utils/get-allowed-origins"

import checkHealth from "./controllers/health-checks/check-health"

import searchRoutes from "./routes/search-routes"
import solanaRoutes from "./routes/solana-routes"
import uploadRoutes from "./routes/upload-routes"
import videosRoutes from "./routes/videos-routes"
import marketRoutes from "./routes/market-routes"
import authRoutes from "./routes/auth/auth-routes"
import creatorRoutes from "./routes/creator-routes"
import encryptionRoutes from "./routes/encryption-routes"
import personalInfoRoutes from "./routes/personal-info-routes"
import positionsAndTransactionsRoutes from "./routes/positions-and-transactions-routes"

dotenv.config({ path: process.env.NODE_ENV === "development" ? ".env.local" : ".env.production" })
// dotenv.config({ path: ".env.production" })

const app = express()

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
app.use("/creator", creatorRoutes)
app.use("/market", marketRoutes)
app.use("/personal-info", personalInfoRoutes)
app.use("/positions-and-transactions", positionsAndTransactionsRoutes)
app.use("/search", searchRoutes)
app.use("/solana", solanaRoutes)
app.use("/upload", uploadRoutes)
app.use("/videos", videosRoutes)

// Internal use:
app.use("/encryption", encryptionRoutes)
app.use("/health", checkHealth)

app.use("*", (req, res) => res.status(404).json({ error: "Route not found"}))

// Initialization of server:
app.listen(8080, "0.0.0.0", () => {
	console.info("Listening on port 8080")
})
