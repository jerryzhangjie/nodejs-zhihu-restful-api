const Router = require('koa-router')
const { 
  find, 
  findById, 
  create, 
  update, 
  delete: del,
  checkQuestioner,
  checkQuestionExist
} = require('../controllers/questions')
const jwt = require('koa-jwt')
const { secret } = require('../config')

const auth = jwt({ secret })

const router = new Router({ prefix: '/questions' })

router.get('/', find)

router.post('/', auth, create)

router.get('/:id', findById)

router.patch('/:id', auth, checkQuestionExist, checkQuestioner, update)  // put 整体修改，patch 只修改一部分

router.delete('/:id', auth, checkQuestionExist, checkQuestioner, del)

module.exports = router