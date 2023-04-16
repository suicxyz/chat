import { config } from "dotenv";
import app from "./app";
config();

const PORT = process.env.PORT || 3001;

console.log(process.env);

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}.`);
});
