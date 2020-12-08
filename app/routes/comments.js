const Router = require('koa-router')
const { 
  find, 
  findById, 
  create, 
  update, 
  delete: del,
  checkCommentator,
  checkCommentExist
} = require('../controllers/comments')
const jwt = require('koa-jwt')
const { secret } = require('../config')

const auth = jwt({ secret })

const router = new Router({ prefix: '/questions/:questionId/answers/:answerId/comments' }) // 三级嵌套实现增删改查

router.get('/', find)

router.post('/', auth, create)

router.get('/:id', checkCommentExist, findById)

router.patch('/:id', auth, checkCommentExist, checkCommentator, update)  // put 整体修改，patch 只修改一部分

router.delete('/:id', auth, checkCommentExist, checkCommentator, del)

module.exports = router