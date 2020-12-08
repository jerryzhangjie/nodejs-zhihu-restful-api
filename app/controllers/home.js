const path = require('path')

class HomeCtl {
  index(ctx) {
    ctx.body = '<h1>主页</h1>'
  }

  // 上传
  upload(ctx) {
    const file = ctx.request.files.file // 获取上传的文件(file 与 页面中的上传按钮input中的name="file"对应)
    const basename = path.basename(file.path)
    ctx.body = { url: `${ctx.origin}/uploads/${basename}` }
  }
}

module.exports = new HomeCtl()