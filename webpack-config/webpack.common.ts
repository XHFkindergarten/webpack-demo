// import * as chalk from 'chalk'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import ProgressBarPlugin from 'progress-bar-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import { join } from 'path'

import { Configuration } from 'webpack'

import paths from './paths'

const ctx = {
  isEnvDevelopment: process.env.NODE_ENV === 'development',
  isEnvProduction: process.env.NODE_ENV === 'production'
}

const { isEnvDevelopment, isEnvProduction } = ctx

const PnpWebpackPlugin = require(`pnp-webpack-plugin`)
// 小型项目无需 thread-loader，因此注释了
// const threadLoader = require('thread-loader');

// threadLoader.warmup(
//   {
//     // 池选项，例如传递给 loader 选项
//     // 必须匹配 loader 选项才能启动正确的池
//   },
//   [
//     'sass-loader',
//   ]
// );

const common: Configuration = {
  // 入口
  entry: {
    index: './src/index.tsx'
  },
  // 输出
  output: {
    // 仅在生产环境添加 hash
    filename: ctx.isEnvProduction
      ? '[name].[contenthash].bundle.js'
      : '[name].bundle.js',
    path: paths.appDist,
    // 编译前清除目录
    clean: true
    // publicPath: ctx.isEnvProduction ? 'https://xxx.com' : '', 关闭该 CDN 配置，因为示例项目，无 CDN 服务。
  },
  resolve: {
    alias: {
      '@': paths.appSrc,
      '@/components': join(paths.appSrc, 'components'),
      '@/hooks': join(paths.appSrc, 'hooks'),
      '@/constant': join(paths.appSrc, 'constant'),
      '@/assets': join(paths.appSrc, 'assets'),
      '@/services': join(paths.appSrc, 'services'),
      '@/utils': join(paths.appSrc, 'utils')
    },
    extensions: ['.tsx', '.js', '.ts', '.jsx'],
    modules: ['node_modules', paths.appSrc],
    symlinks: false,
    plugins: [PnpWebpackPlugin]
  },
  resolveLoader: {
    plugins: [PnpWebpackPlugin.moduleLoader(module)]
  },
  plugins: [
    // 生成html，自动引入所有bundle
    new HtmlWebpackPlugin({
      title: 'release_v1'
    }),
    // 进度条
    // @ts-ignore
    new ProgressBarPlugin({
      format: `  :msg [:bar] (:elapsed s)`,
      total: 100
    })
  ],
  module: {
    rules: [
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        include: paths.appSrc,
        type: 'asset/resource'
      },
      {
        test: /.(woff|woff2|eot|ttf|otf)$/i,
        include: paths.appSrc,
        type: 'asset/resource'
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.module\.(scss|sass)$/,
        include: paths.appSrc,
        use: [
          // 将 JS 字符串生成为 style 节点
          'style-loader',
          ...(isEnvProduction ? [MiniCssExtractPlugin.loader] : []), // 仅生产环境
          // 将 CSS 转化成 CommonJS 模块
          {
            loader: 'css-loader',
            options: {
              // Enable CSS Modules features
              modules: true,
              importLoaders: 2
              // 0 => no loaders (default);
              // 1 => postcss-loader;
              // 2 => postcss-loader, sass-loader
            }
          },
          // 将 PostCSS 编译成 CSS
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  [
                    // postcss-preset-env 包含 autoprefixer
                    'postcss-preset-env'
                  ]
                ]
              }
            }
          },
          // {
          //   loader: 'thread-loader',
          //   options: {
          //     workerParallelJobs: 2
          //   }
          // },
          // 将 Sass 编译成 CSS
          'sass-loader'
        ]
      },
      {
        test: /\.(js|ts|jsx|tsx)$/,
        include: paths.appSrc,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  '@babel/preset-env',
                  {
                    targets: 'defaults',
                    modules: false,
                    bugfixes: true,
                    loose: false,
                    useBuiltIns: 'entry', // 'usage'
                    corejs: { version: 3.8, proposals: false },
                    shippedProposals: true,
                    ignoreBrowserslistConfig: undefined
                  }
                ],
                '@babel/preset-react',
                '@babel/preset-typescript'
              ],
              plugins: ['@babel/plugin-transform-runtime']
            }
          }

          // {
          //   loader: 'esbuild-loader',
          //   options: {
          //     loader: 'tsx',
          //     target: 'es2015'
          //   }
          // }
        ]
      }
    ]
  },
  cache: {
    type: 'filesystem' // 使用文件缓存
  }
}

export default common
