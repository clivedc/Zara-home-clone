const { mergeWithRules } = require("webpack-merge"),
	commonConfig = require("./webpack.config.common"),
	{ EsbuildPlugin } = require("esbuild-loader");

const prodConfig = {
	mode: "production",
	devtool: "source-map",
	output: {
		filename: "[name].[contenthash].js",
	},
	optimization: {
		minimizer: [
			new EsbuildPlugin({
				target: "es5",
				css: true,
				exclude: /node_modules/,
			}),
		],
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/i,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader",
					options: {
						presets: [
							"@babel/preset-env",
							"@babel/preset-typescript",
						],
					},
				},
			},
		],
	},
};

mergeWithRules({})(commonConfig, prodConfig);
