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
