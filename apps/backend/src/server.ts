import "dotenv/config";
import app from "./app.js";
import { getPort } from "./main/config/env.js";

const PORT = getPort();

app.listen(PORT, "0.0.0.0", () => {
	console.log(`Server running on http://0.0.0.0:${PORT}`);
	console.log(`Environment: ${process.env.NODE_ENV ?? "development"}`);
});
