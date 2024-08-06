module.exports = {
	apps : [{
		name: "fortuna-backend-devnet-nodejs",
		script: "./index.js", // Your main application file
		instances: "max", // Number of instances to run
		autorestart: true, // Automatically restart the app if it crashes
		watch: false, // Watch for file changes and reload the app (useful in development)
		env: {
			NODE_ENV: "development" // Default environment variables
		},
		env_devnet_production: {
			NODE_ENV: "production-devnet", // Retrieves Secrets for production devnet
		},
		env_mainnet_production: {
			NODE_ENV: "production-mainnet", // Retrieves Secrets for production mainnet
		}
	}]
}
