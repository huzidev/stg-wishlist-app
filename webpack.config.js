// Webpack uses this to work with directories
const path = require('path');
const glob = require("glob")
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const RemoveEmptyScriptsPlugin = require("webpack-remove-empty-scripts")
const webpack = require('webpack');

// This is the main configuration object.
// Here, you write different options and tell Webpack what to do
module.exports = (env) => {
  const isDevelopment = env.mode === "development"
  return {

    // Path to your entry point. From this file Webpack will begin its work
    entry: {
      main: path.resolve(__dirname, 'theme-code', 'index.js'),
    },

    // Path and filename of your result bundle.
    // Webpack will bundle all JavaScript into this file
    output: {
      path: path.resolve(__dirname, 'extensions', 'wishlist-theme-extenstion', 'assets'),
      publicPath: '',
      filename: '[name].bundle.js'
    },
    // Default mode for Webpack is production.
    // Depending on mode Webpack will apply different things
    // on the final bundle. For now, we don't need production's JavaScript
    // minifying and other things, so let's set mode to development
    mode: 'development',
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /(node_modules)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-react']
            }
          }
        },
        {
          test: /\.jsx$/,
          exclude: /(node_modules)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-react']
            }
          }
        },
        {
          test: /\.css$/,
          exclude: /(node_modules)/,
          use: ['style-loader', 'css-loader'],
        }
      ]
    },
    resolve: {
      extensions: ['.js', '.jsx', '.css']
    },
    plugins: [
      new webpack.ProvidePlugin({
        "React": "react",
      }),
      new RemoveEmptyScriptsPlugin(),
      new CleanWebpackPlugin({
        verbose: true,
        protectWebpackAssets: false,
        cleanAfterEveryBuildPatterns: ['*.LICENSE.txt'],
      }),
    ]
  };
}
