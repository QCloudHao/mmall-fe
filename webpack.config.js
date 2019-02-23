/*
* @Author: qyh
* @Date:   2019-02-22 11:50:13
* @Last Modified by:   qyh
* @Last Modified time: 2019-02-23 19:48:26
*/

var HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

// 
var WEBPACK_ENV = process.env.WEBPACK_ENV || 'dev';

// 获取html-webpack-plugin参数的方法
var getHtmlConfig = function(name){
    return {
        template: './src/view/' + name + '.html',
        filename: 'view/' + name + '.html',
        inject: true,
        hash: true,
        chunks: ['common', name]
    }
};

// webpack config
var config = {
    mode: 'development',
    entry: {
        'common' : ['./src/page/common/index.js'],
        'index' : ['./src/page/index/index.js'],
        'login' : ['./src/page/login/index.js'],
    },
    devServer: {
        contentBase: './dist'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/[name].js'
    },
    externals: {
        'jquery' : 'window.jQuery'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader
                    },
                    'css-loader'
                ]
            },
            {
                test: /\.(png|jpg|gif|woff|svg|eot|ttf)\??.*$/,
                use: [
                  {
                    loader: 'url-loader',
                    options: {
                      limit: 100,
                      outputPath: 'resource',
                      name: '[name].[ext]',
                      publicPath: '../resource'
                    }
                  }
                ]
            }
        ]
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
            // 独立通用模块到js/base.js
                commoms: {
                    name: 'common',
                    test: /\.js$/,
                    chunks: 'initial',
                    minChunks: 1,
                    filename: 'js/base.js',
                    minSize: 0
                }
            }
        }
    },
    plugins: [
        // 把CSS单独打包到文件里
        new MiniCssExtractPlugin({
            filename: "css/[name].css",
            // chunkFilename: "css/[id].css"
        }),
        // HTML模版的处理
        new HtmlWebpackPlugin(getHtmlConfig('index')),
        new HtmlWebpackPlugin(getHtmlConfig('login')),
    ]
};

if('dev' === WEBPACK_ENV){
    config.entry.common.push('webpack-dev-server/client?http://localhost:8088/');
}

module.exports = config;