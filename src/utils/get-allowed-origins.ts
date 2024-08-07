export default function allowedOrigins(): string[] {
	if (process.env.NODE_ENV === "production-devnet") {
		return [ "https://devnet.createfortuna.com" ]
	} else if (process.env.NODE_ENV === "production-mainnet") {
		return [ "https://www.createfortuna.com" ]
	} else {
		return [ "http://localhost:3000" ]
	}
}
