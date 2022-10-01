import fs from 'fs'
import path from 'path'

const appDirectory = fs.realpathSync(process.cwd())
const resolveApp = (relativePath: string) =>
  path.resolve(appDirectory, relativePath)

export default {
  resolveApp,
  appPublic: resolveApp('public'),
  appHtml: resolveApp('public/index.html'),
  appSrc: resolveApp('src'),
  appDist: resolveApp('build'),
  appTsConfig: resolveApp('tsconfig.json'),
  appNodeModules: resolveApp('node_modules')
}
