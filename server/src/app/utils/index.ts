import fs from "fs";

class Utils {
	toBase64(file: string) {
		let bitmap = fs.readFileSync(file, {
			encodig: "base64"
		});

		return bitmap;
	}

	toDataURL(file: string, type = "image/png") {
		let base64 = toBase64(file).toString("base64");
 		let dataUrl = `data:${type};base64,${base64}`;

		return dataUrl;
	}
}

export default new Utils();
