const path = require('path');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');


module.exports = {
    entry: './src/index.tsx',
    output: {
        path: path.resolve(__dirname, '../dist'),
        clean: true,
        chunkFilename: '[id].[chunkhash].js',
    },
    resolve: {
        plugins: [
            new TsconfigPathsPlugin({
                configFile: path.resolve(__dirname, '../tsconfig.json'),
                extensions: ['.ts', '.tsx', '.js', '.json'],
            }),
        ],
        extensions: ['.tsx', '.ts', '.js', '.json'],
        fallback: {
            "crypto": false,
            "https": false,
        },
    },
    ignoreWarnings: [
        /Module not found: Error: Can't resolve '.\/locale'/
    ],
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                include: path.resolve(__dirname, '../src',),
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            "@babel/preset-react",
                            "@babel/preset-typescript",
                            "@babel/preset-env",
                        ],
                        plugins: ["@babel/plugin-transform-runtime"],
                    },
                },
            },
            {
                test: /\.(jpe?g|svg|png|gif|ico|eot|ttf|woff2?)(\?v=\d+\.\d+\.\d+)?$/i,
                type: 'asset/resource',
            },
            {
                test: /\.s[ac]ss$/i,
                use: ['style-loader', 'css-loader', 'sass-loader'],
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
};