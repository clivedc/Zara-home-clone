const { mergeWithRules } = require("webpack-merge"),
	miniCssExtractPlugin = require("mini-css-extract-plugin"),
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
	plugins: [new miniCssExtractPlugin()],
};

module.exports = mergeWithRules({
	plugins: "append",
})(commonConfig, devConfig);
