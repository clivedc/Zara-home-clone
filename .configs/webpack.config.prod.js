const { mergeWithRules } = require("webpack-merge"),
	commonConfig = require("./webpack.config.common"),
	path = require("path"),
	webpackBundleAnalyzerPlugin =
		require("webpack-bundle-analyzer").BundleAnalyzerPlugin,
	{ EsbuildPlugin } = require("esbuild-loader"),
	miniCssExtractPlugin = require("mini-css-extract-plugin");

const useAnalyzer = process.env.npm_config_useAnalyzer;

const prodConfig = {
	mode: "production",
	devtool: "source-map",
	output: {
		filename: "[name].[contenthash].js",
		path: path.resolve(__dirname, "../build"),
		assetModuleFilename: "[name][contenthash][ext]",
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
	plugins: [
		new miniCssExtractPlugin({
			filename: "[name].[contenthash].css",
			chunkFilename: "[name].[contenthash].css",
		}),
		...(useAnalyzer ? [new webpackBundleAnalyzerPlugin()] : []),
	],
};

module.exports = mergeWithRules({
	optimization: {
		minimizer: "append",
	},
	plugins: "append",
})(commonConfig, prodConfig);
