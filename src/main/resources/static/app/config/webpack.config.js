const webpack = require('webpack');
const path = require('path');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const autoprefixer = require('autoprefixer');
const eslintFormatter = require('react-dev-utils/eslintFormatter');
const paths = require('./paths');

const publicPath = '/';

module.exports = {
  mode: 'development',
  devtool: 'source-map',
  entry: [
    './src/index.js',
    './src/styles.scss'
  ],
  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, '../dist'),
    devtoolModuleFilenameTemplate: info => path.resolve(info.absoluteResourcePath).replace(/\\/g, '/'),
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|mjs)$/,
        enforce: 'pre',
        use: [
          {
            options: {
              formatter: eslintFormatter,
              eslintPath: require.resolve('eslint'),
              fix: true
            },
            loader: 'eslint-loader',
          },
        ],
        include: paths.appSrc,
        exclude: [/node_modules/, /vendor/]
      },
      {
        // "oneOf" will traverse all following loaders until one will
        // match the requirements. When no loader matches it will fall
        // back to the "file" loader at the end of the loader list.
        oneOf: [
          // "url" loader works like "file" loader except that it embeds assets
          // smaller than specified limit in bytes as data URLs to avoid requests.
          // A missing `test` is equivalent to a match.
          {
            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/, /\.svg$/],
            loader: 'url-loader',
            options: {
              limit: 10000,
              name: 'media/[name].[ext]',
            },
          },
          // Process JS with Babel.
          {
            test: /\.(js|jsx|mjs)$/,
            // include: paths.appSrc,
            exclude: [/node_modules/, /vendors/],
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-react',
                [
                  '@babel/preset-env',
                  {
                    'shippedProposals': true
                  }
                ]
              ],
              plugins: [
                // Stage 0
                '@babel/plugin-proposal-function-bind',
                // Stage 1
                '@babel/plugin-proposal-export-default-from',
                '@babel/plugin-proposal-logical-assignment-operators',
                [
                  '@babel/plugin-proposal-optional-chaining',
                  {
                    'loose': false
                  }
                ],
                [
                  '@babel/plugin-proposal-pipeline-operator',
                  {
                    'proposal': 'minimal'
                  }
                ],
                [
                  '@babel/plugin-proposal-nullish-coalescing-operator',
                  {
                    'loose': false
                  }
                ],
                '@babel/plugin-proposal-do-expressions',
                // Stage 2
                [
                  '@babel/plugin-proposal-decorators',
                  {
                    'legacy': true
                  }
                ],
                '@babel/plugin-proposal-function-sent',
                '@babel/plugin-proposal-export-namespace-from',
                '@babel/plugin-proposal-numeric-separator',
                '@babel/plugin-proposal-throw-expressions',
                // Stage 3
                '@babel/plugin-syntax-dynamic-import',
                '@babel/plugin-syntax-import-meta',
                [
                  '@babel/plugin-proposal-class-properties',
                  {
                    'loose': false
                  }
                ],
                '@babel/plugin-proposal-json-strings',
                [
                  '@babel/plugin-proposal-object-rest-spread',
                  {
                    'loose': true
                  }
                ]
              ],
              cacheDirectory: true,
            },
          },
          {
            test: /\.(sc|sa)ss$/,
            use: [
              {
                loader: 'style-loader',
              },
              MiniCssExtractPlugin.loader,
              {
                loader: 'css-loader',
              },
              {
                loader: 'resolve-url-loader'
              },
              {
                loader: 'sass-loader',
                options: {
                  sourceMap: true
                }
              },
            ],
          },
          // "postcss" loader applies autoprefixer to our CSS.
          // "css" loader resolves paths in CSS and adds assets as dependencies.
          // "style" loader turns CSS into JS modules that inject <style> tags.
          // In production, we use a plugin to extract that CSS to a file, but
          // in development "style" loader enables hot editing of CSS.
          {
            test: /\.css$/,
            use: [
              {
                loader: 'style-loader'
              },
              {
                loader: 'css-loader',
                options: {
                  importLoaders: 1,
                  modules: true,
                  localIdentName: '[name]__[local]'
                },
              },
              {
                loader: 'postcss-loader',
                options: {
                  // Necessary for external CSS imports to work
                  // https://github.com/facebookincubator/create-react-app/issues/2677
                  ident: 'postcss',
                  plugins: () => [
                    require('postcss-flexbugs-fixes'),
                    autoprefixer({
                      browsers: [
                        '>1%',
                        'last 4 versions',
                        'Firefox ESR',
                        'not ie < 9', // React doesn't support IE8 anyway
                      ],
                      flexbox: 'no-2009',
                    }),
                  ],
                },
              },
            ],
          },
          {
            test: /.html$/,
            use: ['html-loader'],
          },
          // Font-awesome 4.7.X
          {
            test: /\.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
            exclude: [/vendors/, /img/],
            loader: 'file-loader',
            options: {
              limit: 1000,
              name: 'fonts/[name].[ext]'
            },
          },
          // MDB Roboto font
          {
            test: /\.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
            exclude: [/node_modules/, /img/],
            loader: 'file-loader',
            options: {
              limit: 1000,
              name: 'font/roboto/[name].[ext]'
            },
          },
        ],
      },
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'app.css',
      getAllAsyncChunks: true
    })
  ],
};