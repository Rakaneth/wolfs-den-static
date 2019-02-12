const path = require('path')
const webpack = require('webpack')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const resolve = relativePath => path.resolve(__dirname, '..', relativePath)

module.exports = {
    mode: 'development',
    entry: {
        vue: 'vue',
        index: resolve('src/main.js')
    },
    output: {
        filename: 'bundle.js',
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
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: ['@babel/plugin-transform-modules-commonjs']
                    }
                },
                include: [
                    resolve('src'),
                    resolve('node_modules/webpack-dev-server/client')
                ]
            }
        ]
    },
    devtool: 'eval',
    devServer: {
        host: '0.0.0.0',
        port: 8080,
        compress: true,
        open: false,
        watchOptions: {
            ignored: /node_modules/,
            poll: true
        },
        publicPath: '/dist/',
        contentBase: resolve('src/assets'),
        watchContentBase: true,
    },
    plugins: [
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new VueLoaderPlugin()
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

