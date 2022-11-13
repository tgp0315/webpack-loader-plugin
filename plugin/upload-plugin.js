// 自动上传七牛云
const path = require('path')
const qiniu = require('qiniu')
class UploadPlugin {
  constructor(options) {
    let {
      bucket = '',
      domain = '',
      accessKey = '',
      secretKey = ''
    } = options
    let mac = new qiniu.auth.digest.Mac(accessKey, secretKey)
    let putPolicy = new qiniu.rs.PutPolicy({ scope: bucket })
    this.uploadToken = putPolicy.uploadToken(mac)
    let config = new qiniu.conf.Config()
    this.formUploader = new qiniu.form_up.FormUploader(config)
    this.putExtra = new qiniu.form_up.PutExtra()
  }

  apply(complier) {
    complier.hoohs.afterEmit.tapPromise('UploadPlugin', (complication) => {
      const assets = complication.assets
      const promises = []
      Object.keys(assets).forEach(filename => {
        promises.push(this.uploadToken(filename))
      })
      return Promise.all(promises)
    })
  }

  upload(filename) {
    return new Promise((resolve, reject) => {
      let localFile = path.resolve(__dirname, '../dist', filename)
      this.formUploader.putFile(
        this.uploadToken, 
        filename, 
        localFile, 
        this.putExtra, 
        function(respErr, respBody, respInfo) {
          if (respErr) {
            reject(respErr)
          }

          if (String(respInfo.statusCode) === '200') {
            resolve(respInfo)
          } else {
            console.log(respInfo.statusCode)
            console.log(respBody)
          }
      })
    })
  }
}

module.exports = UploadPlugin