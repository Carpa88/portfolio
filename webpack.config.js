const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

const plugins = [
	new MiniCssExtractPlugin({
			filename: '[name].[contenthash].css',
	}), 
	new HtmlWebpackPlugin({
	  template: './src/main.html',
		title: 'Portfolio',
})
]

if (process.env.SERVE) { // Используем плагин только если запускаем devServer
  plugins.push(new ReactRefreshWebpackPlugin());
} // Данный код должен быть размещен после объявления массива plugins


let mode = 'development'; 
let target = 'web';
if (process.env.NODE_ENV === 'production') { 
  mode = 'production';
  target = 'browserslist';
}

module.exports = {
  mode,
  target,
  entry: './src/main.tsx',
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type:  mode === 'production' ? 'asset' : 'asset/resource',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
      { test: /\.(html)$/, use: ['html-loader'] },
      {
        test: /\.css$/i, 
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
        ],
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
			{
        test: /\.jsx?$/, // обновляем регулярное выражение для поддержки jsx
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
          },
        },
      },
      {
        test: /\.js$/,
        exclude: /node_modules/, // не обрабатываем файлы из node_modules
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true, // Использование кэша для избежания рекомпиляции
            // при каждом запуске
          },
        },
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  plugins,
  devServer: {
    static: './dist',
    hot: true,
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    assetModuleFilename: 'assets/[hash][ext][query]',
    clean: true,
    publicPath: '/',
  },
}; 