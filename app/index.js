const Koa = require('koa')
const koaBody = require('koa-body')
const routing = require('./routes')
const error = require('koa-json-error')
const parameter = require('koa-parameter')
const mongoose = require('mongoose')
const path = require('path')
const koaStatic = require('koa-static')
const { connectStr } = require('./config')

mongoose.connect(connectStr, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
  console.log('MongoDB连接成功')
})
mongoose.connection.on('error', console.error)

const app = new Koa()

// 自定义错误中间件（可处理手动抛出 ctx.throw()、以及运行时错误 a.b）
// app.use(async(ctx, next) => {
//   try {
//     await next()
//   } catch (err) {
//     ctx.status = err.status || err.statusCode || 500
//     ctx.body = {
//       message: err.message
//     }
//   }
// })
app.use(koaStatic(path.join(__dirname, 'public')))
app.use(error({
  postFormat: (err, { stack, ...rest }) => process.env.NODE_ENV === 'production' ? rest : { stack, ...rest }
}))
app.use(koaBody({
  multipart: true,  // 启用对文件格式的支持
  formidable: {
    uploadDir: path.join(__dirname, '/public/uploads'),    // 设置文件上传路径
    keepExtensions: true,   // 保留文件扩展名
  }
}))
app.use(parameter(app))

routing(app)

app.listen(3000, () => {
  console.log('程序启动在3000端口了')
})