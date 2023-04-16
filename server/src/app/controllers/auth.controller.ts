import { Request, Response } from "express";

import { User } from "@models";

import bcjs from "bcryptjs";

export default new (class AuthController {
	async getSession (req: Request, res: Response): Promise<Response> {
		const { session } = req;

		try {
			if (!session)
				throw new Error("Session not defined.");

			return res.status(200).json({ session });
		} catch (e) {
			console.error(e);
			return res.status(400).json({ err: e.message });
		}
	}

	async createSession (req: Request, res: Response): Promise<Response> {
		const { body }= req;

		try {
			if (!body)
				throw new Error("Body not defined.");

			let user = await User.findOne({ email: body.email }).select("+password");

			if (!user)
				throw new Error("User not found.");

			if (body.email != user.email ||
					await bcjs.compare(body.password, user.password) == false)
				throw new Error("Invalid credentials");

			user.password = undefined;

			req.session.login = user;

			return res.status(200).json({ session: req.session.login });
		} catch (e) {
			console.error(e);
			return res.status(400).json({ err: e.message });
		}
	}

	async signOut (req: Request, res: Response): Promise<Response> {
		const { uid } = req.params;
		const { login } = req.session;

		try {
			if (!uid)
				throw new Error("ID not specified.");

			if (!login)
				throw new Error("Session not created. Can not sign out.");

			req.session.login = undefined;

			return res.status(200).json({ });
		} catch (e) {
			console.error(e);
			return res.status(400).json({ err: e.message });
		}
	}
});