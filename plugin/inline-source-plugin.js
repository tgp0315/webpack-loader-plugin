// 把外链标签变成内联
const HtmlWebpackPlugin = require('html-webpack-plugin')
class InlineFilePlugin {
  constructor(options) {
    this.options = options
  }
  apply(complier) {
    // 要通过htmlwebpackPlugin来实现这个功能
    complier.hooks.compilation.tap('InlineFilePlugin', (compilation) => {
      HtmlWebpackPlugin.getHooks(compilation).alterAssetTagGroups.tapAsync('afterPlugin', (data, cb) => {
        data = this.processTags(data, compilation)
        cb(null, data)
      })
    })
  }
  // 处理引入标签的数据
  processTags(data, compilation) {
    let headTags = []
    let bodyTags = []
    data.headTags.forEach(headTag => {
      // if (headTag.tagName === 'link')
      headTags.push(this.processTag(headTag, compilation))
    })
    data.bodyTags.forEach(bodyTag => {
      bodyTags.push(this.processTag(bodyTag, compilation))
    })
    // console.log(headTags, bodyTags)
    return {...data, headTags, bodyTags}
  }
  // 处理某一个标签
  processTag(tag, compilation) {
    const reg = this.options.match
    // console.log(compilation, tag.attributes)
    let newTag,url
    if (tag.tagName === 'link' && reg.test(tag.attributes.href)) {
      newTag = {
        tagName: 'style',
        attributes: {
          type: 'text/css'
        }
      }
      url = tag.attributes.href
    }
    if (tag.tagName === 'script' && reg.test(tag.attributes.src)) {
      newTag = {
        tagName: 'script',
        attributes: {
          type: 'application/javascript'
        }
      }
      url = tag.attributes.src
    }

    if (url) {
      newTag.innerHTML = compilation.assets[url].source()
      delete compilation.assets[url] // 删除原有资源
      return newTag
    }
    return tag
  }
}

module.exports = InlineFilePlugin