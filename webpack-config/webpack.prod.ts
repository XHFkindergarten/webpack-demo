import glob from 'glob'
import { merge } from 'webpack-merge'
import TerserPlugin from 'terser-webpack-plugin'
// import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import { PurgeCSSPlugin } from 'purgecss-webpack-plugin'

import common from './webpack.common'
import paths from './paths'

export default merge(common, {
  // 模式
  mode: 'production',
  cache: false,
  plugins: [
    new CleanWebpackPlugin(),
    // 打包体积分析
    // new BundleAnalyzerPlugin(),
    // 提取 CSS
    new MiniCssExtractPlugin({
      filename: '[hash].[name].css'
    }),
    // CSS Tree Shaking
    new PurgeCSSPlugin({
      paths: glob.sync(`${paths.appSrc}/**/*`, { nodir: true }),
      safelist: undefined,
      blocklist: undefined
    })
  ],
  optimization: {
    runtimeChunk: true,
    moduleIds: 'deterministic',
    minimizer: [
      // 在 webpack@5 中，你可以使用 `...` 语法来扩展现有的 minimizer（即 `terser-webpack-plugin`），将下一行取消注释
      // `...`,
      // new CssMinimizerPlugin({
      //   parallel: 4,
      // }),
      new TerserPlugin({
        parallel: 4,
        terserOptions: {
          parse: {
            ecma: 2020
          },
          compress: {
            ecma: 5,
            warnings: false,
            comparisons: false,
            inline: 2
          },
          mangle: {
            safari10: true
          },
          output: {
            ecma: 5,
            comments: false,
            ascii_only: true
          }
        }
      })
    ],
    splitChunks: {
      // include all types of chunks
      chunks: 'all',
      minSize: 2000000,
      // name(module, chunks, cacheGroupName) {
      //   return module.context
      //     .replace(/^.*node_modules/, "")
      //     .replace(/\//g, "_");
      // },
      // 重复打包问题
      cacheGroups: {
        vendors: {
          // node_modules里的代码
          test: /[\\/]node_modules[\\/]/,
          chunks: 'all',
          // name: 'vendors', 一定不要定义固定的name
          priority: 10, // 优先级
          enforce: true
        }
      }
    }
  }
})
