const { mergeWithRules } = require("webpack-merge"),
	commonConfig = require("./webpack.config.common"),
	path = require("path"),
	webpackBundleAnalyzerPlugin =
		require("webpack-bundle-analyzer").BundleAnalyzerPlugin,
	{ EsbuildPlugin } = require("esbuild-loader");

const prodConfig = {
	mode: "production",
	devtool: "source-map",
	output: {
		filename: "[name].[contenthash].js",
		path: path.resolve(__dirname, "../build"),
	},
	optimization: {
		minimizer: [
			new EsbuildPlugin({
				target: "es6",
				css: true,
				exclude: /node_modules/,
			}),
		],
		runtimeChunk: "single",
		splitChunks: {
			cacheGroups: {
				vendor: {
					test: /node_modules/,
					name: "vendors",
					chunks: "all",
				},
			},
		},
	},
	plugins: [new webpackBundleAnalyzerPlugin()],
};

module.exports = mergeWithRules({
	optimization: {
		minimizer: "append",
	},
	plugins: "append",
})(commonConfig, prodConfig);
