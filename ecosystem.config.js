module.exports = {
	apps : [{
		name: "fiftyone-backend-nodejs",
		script: "./index.js", // Your main application file
		instances: "max", // Number of instances to run
		autorestart: true, // Automatically restart the app if it crashes
		watch: false, // Watch for file changes and reload the app (useful in development)
		env: {
			NODE_ENV: "development" // Default environment variables
		},
		env_production: {
			NODE_ENV: "production", // Environment variables for production
		}
	}]
}
