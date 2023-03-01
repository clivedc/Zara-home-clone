const path = require("path"),
	miniCssExtractPlugin = require("mini-css-extract-plugin"),
	forkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin"),
	htmlWebpackPlugin = require("html-webpack-plugin"),
	ImageMinimizerPlugin = require("image-minimizer-webpack-plugin"),
	devMode = process.env.NODE_ENV !== "production";

module.exports = {
	entry: "./src/index.tsx",
	output: {
		// filename: "bundle.js",
		path: path.join(__dirname, "..", "dist"),
		clean: true,
	},
	watchOptions: {
		ignored: [path.resolve(__dirname, "node_modules")],
	},
	resolve: {
		extensions: [".tsx", ".ts", "..."],
	},
	module: {
		rules: [
			{
				test: /\.css$/i,
				use: [
					miniCssExtractPlugin.loader,
					{
						loader: "css-loader",
						options: {
							importLoaders: 1,
							modules: true,
						},
					},
				],
				include: /\.module\.css$/i,
			},
			{
				test: /\.jpe?g$/i,
				type: "asset/resource",
				generator: {
					filename: "assets/images/[name][ext]",
				},
			},
			{
				test: /\.css$/i,
				use: [miniCssExtractPlugin.loader, "css-loader"],
				exclude: /\.module\.css$/i,
			},
		],
	},
	plugins: [
		new htmlWebpackPlugin({
			title: "Zara-Home-Clone",
			template: "src/template.html",
		}),
		new miniCssExtractPlugin({
			filename: devMode ? "[name].css" : "[name].[contenthash].css",
		}),
		new forkTsCheckerWebpackPlugin(),
	],
	optimization: {
		minimizer: [
			"...",
			new ImageMinimizerPlugin({
				generator: [
					{
						preset: "webp",
						filename: "assets/images/[name][ext]",
						implementation: ImageMinimizerPlugin.sharpGenerate,
						options: {
							encodeOptions: {
								webp: {
									quality: 90,
								},
							},
						},
					},
				],
			}),
		],
	},
};
