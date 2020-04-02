// [定数] webpack の出力オプションを指定します
// 'production' か 'development' を指定
const MODE = (process.env.NODE_ENV) || "development";

// ソースマップの利用有無(productionのときはソースマップを利用しない)
const enabledSourceMap = MODE === "development";

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const workboxPlugin = require('workbox-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');


module.exports = {
  mode: MODE,
  // メインとなるJavaScriptファイル（エントリーポイント）
  entry: `./src/index.js`,
  devServer: {
    contentBase: "docs",
    open: true,
    watchContentBase: true
  },
  // ファイルの出力設定
  output: {
    //  出力ファイルのディレクトリ名
    path: `${__dirname}/docs`,
    // 出力ファイル名
    filename: "main.js"
  },
  module: {
    rules: [
      {
        test: /\.(jpg|png|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'images/',
              /* es2015ならば
              publicPath : path => '../' + path
              で書けます。*/
            }
          }
        ]
      },
      {
        test: /\.ejs$/,
        use: [
          'html-loader',
          'ejs-html-loader'
        ]
      },
      // CSSファイルの読み込み
      {
        // 対象となるファイルの拡張子
        test: /\.css/,
        // ローダー名
        use: [
          // linkタグに出力する機能
          MODE === "development" ? "style-loader" : MiniCssExtractPlugin.loader,
          // CSSをバンドルするための機能
          {
            loader: "css-loader",
            options: {
              // オプションでCSS内のurl()メソッドの取り込みを禁止する
              url: false,
              // ソースマップを有効にする
              sourceMap: enabledSourceMap
            }
          }
        ]
      },
      // Lessファイルの読み込みとコンパイル
      {
        test: /\.less/, // 対象となるファイルの拡張子
        use: [
          // linkタグに出力する機能
          MODE === "development" ? "style-loader" : MiniCssExtractPlugin.loader,
          // CSSをバンドルするための機能
          {
            loader: "css-loader",
            options: {
              // オプションでCSS内のurl()メソッドの取り込みを禁止する
              url: false,
              // ソースマップの利用有無
              sourceMap: enabledSourceMap,

              // 0 => no loaders (default);
              // 1 => postcss-loader;
              // 2 => postcss-loader, sass-loader
              importLoaders: 2
            }
          },
          {
            loader: "less-loader",
            options: {
              // ソースマップの利用有無
              sourceMap: enabledSourceMap
            }
          }
        ]
      }
    ]
  },
  optimization: {
    minimizer: [
      new OptimizeCSSAssetsPlugin() // CSS の minify を行う
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/main.css'
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/index.ejs'
    }),
    new HtmlWebpackPlugin({
      filename: 'facilities.html',
      template: 'src/facilities.ejs'
    }),
    new HtmlWebpackPlugin({
      filename: 'concerthall.html',
      template: 'src/concerthall.ejs'
    }),
    new workboxPlugin.GenerateSW()
  ]
};