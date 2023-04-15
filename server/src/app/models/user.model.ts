import mongoose from "../database";

import bcjs from "bcryptjs";

const UserSchema = new mongoose.Schema({
	username: {
		type: String,
		trim: true,
		require: true
	},
	email: {
		type: String,
		trim: true,
		require: true,
		unique: true,
		lowercase: true
	},
	password: {
		type: String,
		trim: true,
		require: true,
		unique: true,
		select: false,
	},
	pp: {
		type: String,
		trim: true,
	},
	is_admin: {
		type: Boolean,
		default: false
	},
	createdAt: {
		type: Date,
		default: Date.now
	}
});

UserSchema.pre("save", async function(next: any) {
	this.password = await bcjs.hash(this.password, 16);
	next();
});

export default mongoose.model("User", UserSchema);
