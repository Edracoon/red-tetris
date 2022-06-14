/** @type {import('@playwright/test').PlaywrightTestConfig} */
const config = {
	webServer: {
		command: "npm run dev",
		port: 3000,
		reuseExistingServer: true
	}
};

export default config;
