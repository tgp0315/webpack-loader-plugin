// 添加文件注释
const babel = require('@babel/core')
const { validate } = require('schema-utils')
const fs = require('fs')
const path = require('path')
function loader(source) {
  const options = this.query
  const cb = this.async()
  // 是否添加缓存
  options.cacheable && this.cacheable()
  let scheam = {
    type: 'object',
    properties: {
      text: {
        type: 'string'
      },
      filename: {
        type: 'string'
      }
    }
  }
  validate(scheam, options, 'banner-loader')
  if (options.filename) {
    // 加入文件监听
    this.addDependency(options.filename)
    fs.readFile(options.filename, 'utf-8', function(err, data) {
      cb(err, `/**${data}*/${source}`)
    })
  } else {
    cb(null, `/**${options.text}*/${source}`)
  }
  return options
}

module.exports = loader