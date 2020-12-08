const fs = require('fs')

module.exports = (app) => {
  fs.readdirSync(__dirname).forEach(file => {
    if (file === 'index.js') return
    console.log(file)
    const route = require(`./${file}`)
    app.use(route.routes()).use(route.allowedMethods())
  })
}