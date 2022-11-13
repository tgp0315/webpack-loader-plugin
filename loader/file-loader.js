const loaderUtils = require('loader-utils')
// 需要返回一个路径
function loader(source) {
  const filename = loaderUtils.interpolateName(this, '[hash].[ext]', {
    content: source
  })
  this.emitFile(filename, source) // 输出文件
  return `module.exports = "${filename}"`
  // return source
}
// 设置为二进制
loader.raw = true
module.exports = loader