import { Request, Response, NextFunction } from "express";

import fs from "fs";
import path from "path";

import { permissions } from "@config";

export default async (req: Request, res: Response, next: NextFunction) => {
	const { login } = req.session;
	const { url, method } = req;

	try {
		if (!login)
			throw new Error("Can not conclude operation without been logged in. Please log in first.");

		if (url == "/api/auth/create" && session)
			throw new Error("Session already set.");

		for (let i of permissions) {
			let meth: string = item.split("[")[1].split("]")[0];
			let route: string = item.split("]")[1].split("=")[0];
			let level: number = parseInt(item.split("=")[1]);

			if (method == meth && url == route) {
				switch (level) {
					case -1:
						if (session)
							throw new Error("Session already set.");
						return next();

					case 0:
						return next();

					case 1:
						if (!session)
							throw new Error("Can not conclude operation without been logged in. Please log in first.");

						return next();

					case 2:
						if (!session)
							throw new Error("Can not conclude operation without been logged in. Please log in first.");
						else
							if (!session.is_admin)
								throw new Error("Only moderators can do this.");

							return next();

					default:
						throw new Error("Unknow error.");
				}
			}
		}
	} catch (e) {
		console.error(e);
		return res.status(403).json({ err: e.message });
	}
}