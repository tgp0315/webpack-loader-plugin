const path = require('path')
// const DonePluin = require('./plugin/DonePlugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FileListPlugin = require('./plugin/file-list-plugin.js')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const InlineFilePlugin = require('./plugin/inline-source-plugin.js')
// const UploadPlugin = require('./plugin/upload-plugin.js')
module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    // publicPath: '', // 七牛静态资源地址
  },
  resolveLoader: {
    // alias: {
    //   'loader1': path.resolve(__dirname, 'loader/loader1.js')
    // },
    modules: [path.resolve(__dirname, 'node_modules'),path.resolve(__dirname, 'loader')]
  },
  // watch: true,
  devtool: 'source-map',
  module: {
    // loader 分类  pre 在前面  post 在后面   normal
    // loader 执行顺序   pre normal inline post
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      },
      {
        test: /\.(jpg|png|svg)$/,
        //根据图片生成MD5放到dist目录下 file-loader 还会返回图片当前路径
        use: {
          loader: 'url-loader',
          options: {
            limit: 102400
          }
        }
      },
      // {
      //   test: /\.(jpg|png|svg)$/,
      //   //根据图片生成MD5放到dist目录下 file-loader 还会返回图片当前路径
      //   use: 'file-loader'
      // },
      // {
      //   test: /\.js$/,
      //   use: {
      //     loader: 'banner-loader',
      //     options: {
      //       text:'test',
      //       filename: path.resolve(__dirname, 'banner.js')
      //     }
      //   }
      // }
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env'
            ]
          }
        }
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'main.css'
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'index.html'),
      filename: 'index.html',
    }),
    new FileListPlugin({
      filename: 'list.md'
    }),
    new InlineFilePlugin({
      match: /\.(js|css)/
    }),
    // new UploadPlugin({
    //   bucket: '',
    //   domain: '',
    //   accessKey: '',
    //   secretKey: ''
    // })
  ]
}