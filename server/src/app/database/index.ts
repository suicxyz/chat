import mongoose from "mongoose";
import { config } from "dotenv";
config();

mongoose.set("strictQuery", false);
mongoose.connect(
	`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hdalw.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
);
mongoose.Promise = global.Promise;

export default mongoose;