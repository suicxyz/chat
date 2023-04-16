import "express-session";
import "src/app/database";

declare module "express-session" {
	interface SessionData extends mongoose.Document {
		login?: {
			_id?: mongoose.Schema.Types.ObjectId;
			username?: string;
			email?: string;
			password?: string;
			pp?: string;
			is_admin?: boolean;
			createdAt?: Date;
		}
	}
}