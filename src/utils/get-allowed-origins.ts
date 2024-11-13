export default function allowedOrigins(): string[] {
	if (process.env.NODE_ENV === "production") {
		return [ "https://createfortuna.com", "https://www.createfortuna.com" ]
	} else if (process.env.NODE_ENV === "staging") {
		return [ "https://devnet.createfortuna.com" ]
	} else {
		return [ "http://localhost:3000" ]
	}
}
