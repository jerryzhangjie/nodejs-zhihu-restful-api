const Router = require('koa-router')
const { 
  find, 
  findById, 
  create, 
  update, 
  delete: del,
  checkAnswerer,
  checkAnswerExist
} = require('../controllers/answers')
const jwt = require('koa-jwt')
const { secret } = require('../config')

const auth = jwt({ secret })

const router = new Router({ prefix: '/questions/:questionId/answers' }) // 二级嵌套实现增删改查

router.get('/', find)

router.post('/', auth, create)

router.get('/:id', checkAnswerExist, findById)

router.patch('/:id', auth, checkAnswerExist, checkAnswerer, update)  // put 整体修改，patch 只修改一部分

router.delete('/:id', auth, checkAnswerExist, checkAnswerer, del)

module.exports = router