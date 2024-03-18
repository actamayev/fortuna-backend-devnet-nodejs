import express from "express"

import solanaDevnetRoutes from "./solana-devnet-routes"

const solanaRoutes = express.Router()

solanaRoutes.use("/devnet", solanaDevnetRoutes)

export default solanaRoutes
