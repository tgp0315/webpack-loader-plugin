class FileListPlugin {
  constructor(options) {
    this.filename = options.filename || 'index.md'
  }
  apply(complier) {
    // 文件已经准备好
    complier.hooks.emit.tap('FileListPlugin', (complication) => {
      // console.log(complication.assets)
      let assets = complication.assets
      let content = `## 文件名   资源大小\r\n`
      Object.entries(assets).forEach(([filename, statObj]) => {
        content += `- ${filename}  ${statObj.size()}\r\n`
      })
      assets[this.filename] = {
        source() {
          return content
        },
        size() {
          return content.length
        }
      }
    })
  }
}

module.exports = FileListPlugin