/**
 * Build config for electron renderer process
 */

import path from 'path';
import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import merge from 'webpack-merge';
import UglifyJSPlugin from 'uglifyjs-webpack-plugin';
import baseConfig from './webpack.config.base';
import CheckNodeEnv from './internals/scripts/CheckNodeEnv';

CheckNodeEnv('production');

export default merge.smart(baseConfig, {
  devtool: 'source-map',

  target: 'electron-renderer',

  entry: './app/index',

  output: {
    path: path.join(__dirname, 'app/dist'),
    publicPath: 'dist/',
    filename: 'renderer.prod.js'
  },

  module: {
    rules: [
      // Extract all .global.css to style.css as is
      {
        test: /\.global\.css$/,
        use: ExtractTextPlugin.extract({
          publicPath: './',
          use: {
            loader: 'css-loader',
            options: {
              minimize: true,
            }
          },
          fallback: 'style-loader',
        })
      },
      // Pipe other styles through css modules and append to style.css
      {
        test: /^((?!\.global).)*\.css$/,
        use: ExtractTextPlugin.extract({
          use: {
            loader: 'css-loader',
            options: {
              modules: true,
              minimize: true,
              importLoaders: 1,
              localIdentName: '[name]__[local]__[hash:base64:5]',
            }
          }
        }),
      },
      // Add SASS support  - compile all .global.scss files and pipe it to style.css
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          use: [
            {
              loader: 'css-loader',
              options: {
                minimize: true,
              }
            },
            {
              loader: 'sass-loader'
            }
          ],
          fallback: 'style-loader',
        })
      },
      // WOFF Font
      {
        test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
        use: {
          loader: 'url-loader',
          options: {
            mimetype: 'application/font-woff',
          }
        },
      },
      // WOFF2 Font
      {
        test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
        use: {
          loader: 'url-loader',
          options: {
            mimetype: 'application/font-woff',
          }
        }
      },
      // TTF Font
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        use: {
          loader: 'url-loader',
          options: {
            mimetype: 'application/octet-stream'
          }
        }
      },
      // EOT Font
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        use: 'file-loader',
      },
      // SVG Font
      /* {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            mimetype: 'image/svg+xml',
          }
        }
      }, */
      // Common Image Formats
      {
        test: /\.(?:ico|gif|png|jpg|jpeg|webp|svg)$/,
        use: 'url-loader',
      }
    ]
  },

  plugins: [
    /**
     * Create global constants which can be configured at compile time.
     *
     * Useful for allowing different behaviour between development builds and
     * release builds
     *
     * NODE_ENV should be production so that modules do not perform certain
     * development checks
     */
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'production'
    }),

    new UglifyJSPlugin({
      parallel: true,
      sourceMap: true
    }),

    new ExtractTextPlugin('style.css'),

    new BundleAnalyzerPlugin({
      analyzerMode: process.env.OPEN_ANALYZER === 'true' ? 'server' : 'disabled',
      openAnalyzer: process.env.OPEN_ANALYZER === 'true'
    }),
  ],
});
