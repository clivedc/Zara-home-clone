const { mergeWithRules } = require("webpack-merge"),
	commonConfig = require("./webpack.config.common"),
	path = require("path");

const devConfig = {
	mode: "development",
	devtool: "inline-source-map",
	output: {
		filename: "bundle.js",
	},
	devServer: {
		static: path.resolve(__dirname, "dist"),
		open: true,
		hot: true,
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
					tsconfig: ".configs/tsconfig.json",
				},
			},
		],
	},
};

module.exports = mergeWithRules({
	module: {
		rules: {
			test: "match",
			use: "append",
		},
	},
})(commonConfig, devConfig);

// console.log(config.module.rules);
