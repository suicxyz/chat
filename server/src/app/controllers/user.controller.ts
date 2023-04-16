import { Request, Response } from "express";

import bcjs from "bcryptjs";
import formidable from "formidable";

import { User } from "@models";
import { toDataURL } from "src/app/utils";

export default new (class UserController {
	async list(req: Request, res: Response): Promise<Response> {
		try {
			const users = await User.find();

			return res.status(200).json({ users });
		} catch (e) {
			console.error(e);
			return res.status(400).json({ err: e.message });
		}
	}

	async get(req: Request, res: Response): Promise<Response> {
		const { uid } = req.params;

		try {

			if (!uid)
				throw new Error("UID not specified.");

			const user = await User.findById(uid);

			return res.status(200).json({ user });
		} catch (e) {
			console.error(e.message);
			return res.status(400).json({ err: e.message });
		}
	}

	async create(req: Request, res: Response): Promise<Response> {
		const { body } = req;

		try {
			if (!body) 
				throw new Error("Body not specified.");

			const { username, email, password } = body;

			let user = await User.findOne({ email });

			if (user)
				throw new Error("User already exists.");

			const form = new formidable.IncomingForm();
			let pp;

			if (body.pp) {
				form.parse(req, async (e, fields, files) => {
					if (e)
						throw e;

					let oldPath = files.pp.filepath;
					let newPath = `${process.env.INIT_CWD}/server/src/tmp/${Date.now()}-${files.pp.originalFilename}`;

					fs.copyFileSync(oldPath, newPath);

					const data = toDataURL(newPath);

					setTimeout(() => {
						fs.rmSync(oldPath);
						fs.rmSync(newPath);
					}, 5000);

					pp = data;
				});
			}

			user = await User.create({ username, password, email, pp });
			user.password = undefined;

			return res.status(200).json({ user });
		} catch (e) {
			console.log(e);
			return res.status(400).json({ err: e.message });
		}
	}

	async update(req: Request, res: Response): Promise<Response> {
		const { body } = req;
		const { uid } = req.params;

		try {
			if (!uid) 
				throw new Error("UID not specified.");

			if (!body || !body.password || !body.email)
				throw new Error("Please, specify e-mail, password and the field to be updated.");

			let user = await User.findById(uid).select("+password");

			if (!user)
				throw new Error("User not found. Check specified ID.");

			if (body.email != user.email ||
					await bcjs.compare(body.password, user.password) == false)
				throw new Error("Invalid credentials");

			body.email = undefined;
			body.password = undefined;

			user = await User.findByIdAndUpdate(uid, body, { new: true });

			return res.status(200).json({ user });
		} catch (e) {
			console.error(e);
			return res.status(400).json({ err: e.message });
		}
	}

	async delete(req: Request, res: Response): Promise<Response> {
		const { uid } = req.params;
		const { body } = req;

		try {
			if (!uid) 
				throw new Error("UID not specified.");

			if (!body || !body.password || !body.email)
				throw new Error("Please, specify e-mail, password.");

			let user = await User.findById(uid).select("+password");

			if (!user)
				throw new Error("User not found. Check specified ID.");

			if (body.email != user.email ||
					await bcjs.compare(body.password, user.password) == false)
				throw new Error("Invalid credentials");

			await User.findByIdAndDelete(uid);

			return res.status(200).json({ });
		} catch (e) {
			console.error(e);
			return res.status(400).json({ err: e.message });
		}
	}
})();