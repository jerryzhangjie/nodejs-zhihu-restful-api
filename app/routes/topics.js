const Router = require('koa-router')
const { 
  find, 
  findById, 
  create, 
  update,
  checkTopicExist,
  listTopicFollowers,
  listQuestions
} = require('../controllers/topics')
const jwt = require('koa-jwt')
const { secret } = require('../config')

const auth = jwt({ secret })

const router = new Router({ prefix: '/topics' })

router.get('/', find)

router.post('/', auth, create)

router.get('/:id', checkTopicExist, findById)

router.patch('/:id', auth, checkTopicExist, update)  // put 整体修改，patch 只修改一部分

router.get('/:id/followers', checkTopicExist, listTopicFollowers)

router.get('/:id/questions', checkTopicExist, listQuestions)

module.exports = router