let allowedOrigins: string[]
if (process.env.NODE_ENV === "production-devnet") {
	allowedOrigins = [ "https://devnet.createfortuna.com" ]
} else if (process.env.NODE_ENV === "production-mainnet") {
	allowedOrigins = [ "https://www.createfortuna.com" ]
} else {
	allowedOrigins = [ "http://localhost:3000" ]
}

export default allowedOrigins

