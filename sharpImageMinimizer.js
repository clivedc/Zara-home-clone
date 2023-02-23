const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const targetPath = path.resolve(__dirname, "assets");
const destinationPath = path.resolve(__dirname, "optimizedAssets");
fs.readdir(targetPath, async (err, files) => {
	if (err) {
		console.log("FAILED :(\n" + err);
		return;
	}

	await Promise.all(
		files.map((file) => {
			const targetFilePath = path.join(targetPath, file);
			const destinationFilePath = path.join(
				destinationPath,
				`optimized${file}`
			);
			sharp(targetFilePath)
				.jpeg({ quality: 75 })
				.toFile(destinationFilePath);
		})
	);

	console.log("done :D");
});
