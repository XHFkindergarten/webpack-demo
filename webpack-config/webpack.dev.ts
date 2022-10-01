import webpack from 'webpack'
import { merge } from 'webpack-merge'
import SpeedMeasurePlugin from 'speed-measure-webpack-plugin'
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin'
import common from './webpack.common'

const smp = new SpeedMeasurePlugin()

const isNeedSpeed = true

const config = merge(common, {
  // 模式
  mode: 'development',
  // 开发工具，开启 source map，编译调试
  devtool: 'eval-cheap-module-source-map',
  // 开发模式，自动更新改动
  // devServer: {
  //   // contentBase: './dist',
  //   // hot: true // 热更新
  // },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new ReactRefreshWebpackPlugin()
  ]
})

export default isNeedSpeed ? smp.wrap(config as any) : config
