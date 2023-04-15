import express, { Application, Request, Response, NextFunction } from "express";
import session from "express-session";
import cors from "cors";

import { auth } from "@config";

import router from "./router";

class App {
	app: Application;

	constructor() {
		this.app = express();
		this.middlewares();
		this.routes();
	}

	middlewares() {
		this.app.use(express.json());
		this.app.use(express.urlencoded({ extended: true }));
		this.app.use(session(auth));
		this.app.set("trust proxy", 1);
		this.app.use((_req: Request, res: Response, next: NextFunction) => {
			res.header("Access-Control-Allow-Origin", "*");
			res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
			res.header(
				"Access-Control-Allow-Headers",
				"Access, Content-Type, Authorization, Accept, Origin, X-Requested-With"
			);

			this.app.use(cors());
			next();
		});
	}

	routes() {
		this.app.use(router);
	}
}

export default new App().app;
