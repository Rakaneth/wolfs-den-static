const path = require('path')
const webpack = require('webpack')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const resolve = relativePath => path.resolve(__dirname, '..', relativePath)
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

let cleanPaths = ['dist']
let cleanOpts = { root: resolve('.') }
let htmlOpts = {
    template: './src/assets/index.html',
    filename: './index.html'
}

module.exports = {
    mode: 'development',
    entry: {
        vue: 'vue',
        index: resolve('src/main.js')
    },
    output: {
        filename: '[name].js',
        path: resolve('dist'),
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
            },
            {
                test: /\.css$/,
                use: [
                    'vue-style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.html$/,
                loader: 'html-loader'
            }
        ]
    },
    devtool: 'inline-source-maps',
    devServer: {
        port: 8080,
        compress: true,
        open: true,
        hot: true,
        watchOptions: {
            ignored: /node_modules/,
            poll: true
        },
        contentBase: './dist',
        watchContentBase: true,
    },
    plugins: [
        new CleanWebpackPlugin(cleanPaths, cleanOpts),
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new VueLoaderPlugin(),
        new HtmlWebpackPlugin(htmlOpts)
    ],
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js'
        },
        extensions: ['*', '.vue', '.js', '.json']
    },
    performance: {
        hints: false
    }
}

