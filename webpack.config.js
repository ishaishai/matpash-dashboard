const path = require('path');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');


module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/'
  },
  devServer: {
    historyApiFallback: true, //https://stackoverflow.com/questions/43209666/react-router-v4-cannot-get-url
  },
  plugins: [
    new MiniCssExtractPlugin({filename: '[name].css'}),
    new HtmlWebPackPlugin({
      template: "./src/index.html",
      filename: "./index.html"
    })
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.(html)$/,
        use: [
          {
            loader: "html-loader"
          }
        ]
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]//use: [loader-b","loader-a"]
      },
      {
        test: /\.(scss)$/,
        use: [
          {
            // Adds CSS to the DOM by injecting a `<style>` tag
            /*loader: 'style-loader'*/
            loader: MiniCssExtractPlugin.loader
          },
          {
            // Interprets `@import` and `url()` like `import/require()` and will resolve them
            loader: 'css-loader'
          },
          {
            // Loader for webpack to process CSS with PostCSS
            loader: 'postcss-loader',
            options: {
              plugins: function () {
                return [
                  require('autoprefixer')
                ];
              }
            }
          },
          {
            // Loads a SASS/SCSS file and compiles it to CSS
            loader: 'sass-loader'
          }
        ]
      }
    ]
  }
};
