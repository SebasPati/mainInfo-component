const { merge } = require ('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const commonConfig = require('./webpack.common');
const packageJson = require('../package.json');
const Dotenv = require('dotenv-webpack');
const path = require("path");

const devConfig = {
	mode : "development",
	devtool: "source-map",
	devServer: {
		port: 4200,
		historyApiFallback: true,
		hot: true,
		static: {
			directory: path.join('public'),
		},
		compress: true,
	},
	plugins : [
		new ModuleFederationPlugin({
			name : "pgMainInfo",
			filename : "remoteEntry.js",
			exposes : {
				"./pgMainInfoApp" : "./src/bootstrap"
			},
			shared : packageJson.dependencies
		}),
		new HtmlWebpackPlugin({
			template: path.join('public', 'index.html'),
		})
	]
};

module.exports = merge(commonConfig, devConfig);
