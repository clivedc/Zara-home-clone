const path = require("path"),
	miniCssExtractPlugin = require("mini-css-extract-plugin"),
	forkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin"),
	htmlWebpackPlugin = require("html-webpack-plugin"),
	ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

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
		extensions: [".tsx", ".ts", ".jpg", "..."],
		alias: {
			Assets: path.resolve(__dirname, "../assets"),
		},
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/i,
				loader: "esbuild-loader",
				exclude: /node_modules/,
				options: {
					loader: "tsx",
					target: "es6",
					// tsconfig: ".configs/tsconfig.json",
				},
			},

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
				test: /\.css$/i,
				use: [miniCssExtractPlugin.loader, "css-loader"],
				exclude: /\.module\.css$/i,
			},
			{
				test: /\.(jpg|svg)$/i,
				type: "asset/resource",
				generator: {
					filename: "resources/images/[name][ext]",
				},
			},
			{
				test: /\.mp4$/i,
				type: "asset/resource",
				generator: {
					filename: "resources/videos/[name][ext]",
				},
			},
		],
	},
	plugins: [
		new htmlWebpackPlugin({
			title: "Zara-Home-Clone",
			template: "src/template.html",
		}),
		new forkTsCheckerWebpackPlugin(),
	],
	optimization: {
		minimizer: [
			new ImageMinimizerPlugin({
				minimizer: {
					implementation: ImageMinimizerPlugin.sharpMinify,
					options: {
						encodeOptions: {
							jpeg: {
								quality: 75,
							},
						},
					},
				},
				generator: [
					{
						preset: "webp",
						filename: "resources/images/[name][ext]",
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
