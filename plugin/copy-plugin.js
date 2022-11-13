const { validate } = require('schema-utils')
const globby = require('globby') // 匹配文件变化,处理忽略文件
const path = require('path')
const webpack = require('webpack')
const fs = require('fs')
const { RawSource } = webpack.sources
class CopyPlugin {
  constructor(options) {
    let scheam = {
      type: 'object',
      properties: {
        from: {
          type: 'string'
        },
        to: {
          type: 'string'
        },
        ignore: {
          type: 'array'
        }
      },
      additionalProperties: false // 不允许新增
    }
    validate(scheam, options, 'CopyPlugin')
    this.options = options
  }
  apply(compiler) {
    // 初始化compilation
    compiler.hooks.thisCompilation.tap('CopyPlugin', (compilation) => {
      // 添加资源的hooks
      compilation.hooks.additionalAssets.tapAsync('CopyPlugin', async cb => {
        const { from, ignore = [], to = '.' } = this.options
        const context = compiler.options.context // prcess.cwd()
        // 将from中资源复制到to 
        // 读取from中文件，过滤忽略文件，生成webpack格式资源，添加到compilation中输出到to
        const absoluteFrom = path.isAbsolute(from) ? from : path.resolve(context, from).replace(/\\/g, '/')
        const paths = await globby(absoluteFrom, { ignore })
        
        // console.log(paths, absoluteFrom, 'paths')
        const files = paths.map(p => {
          const data = fs.readFileSync(p, 'utf-8')
          const relativePath = path.basename(p)
          const filename = path.join(to, relativePath)
          return {
            data,
            filename
          }
        })
        console.log(files)
        const assets = files.map(file => {
          const source = new RawSource(file.data)
          return {
            source,
            filename: file.filename
          }
        })

        assets.forEach(asset => {
          compilation.emitAsset(asset.filename, asset.source)
        })

        cb()
      })
    })
  }
}

module.exports = CopyPlugin