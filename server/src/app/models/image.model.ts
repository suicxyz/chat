import mongoose from "src/app/database/mongoose";

const ImageSchema = new mongoose.Schema({
	name: {
		type: String,
		trim: true,
		require: true
	},
	data: {
		type: String,
		trim: true,
		require: true
	},
	createdAt: {
		type: Date,
	default: Date.now
	}
});

export default mongoose.model("Image", ImageSchema);
