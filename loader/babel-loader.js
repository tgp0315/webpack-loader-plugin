const babel = require('@babel/core')
const fs = require('fs')
const path = require('path')
const root = process.cwd()
// const ignore = ['node_modules']
// const targetFile = ['babel.config.js']
function readFileList() {
  const files = fs.readdirSync(root)
  files.forEach((item, index) => {
    if (item === '.babelrc') {
      const content = fs.readFileSync(path.resolve(root, '.babelrc'), 'utf-8')
      return content ? content : {}
    }
    if (item === 'babel.config.js') {
      const content = require(path.resolve(root, 'babel.config.js'))
      return content ? content : {}
    }
    return {}      
  })
}
const options = readFileList()
function loader(source) {
  const { presets = [], plugins = [] } = Object.assign(this.query, options)
  let cb = this.async()
  babel.transform(source, {
    presets,
    plugins,
    sourceMap: true,
    filename: this.resourcePath.split('/').pop()
  }, function(err, result) {
    cb(err, result.code, result.map)
  })
}

module.exports = loader