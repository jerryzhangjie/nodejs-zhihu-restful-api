const Router = require('koa-router')
const { 
  find, 
  findById, 
  create, 
  update, 
  delete: del, 
  login,
  checkOwner,
  listFollowing,
  listFollowers,
  checkUserExist,
  follow,
  unfollow,
  listFollowingTopics,
  followTopic,
  unfollowTopic,
  listQuestions,
  listLikingAnswers,
  likeAnswer,
  unlikeAnswer,
  listDislikingAnswers,
  dislikeAnswer,
  undislikeAnswer,
  listCollectingAnswers,
  collectAnswer,
  uncollectAnswer,
} = require('../controllers/users')
const {
  checkTopicExist
} = require('../controllers/topics')
const {
  checkAnswerExist
} = require('../controllers/answers')
const jwt = require('koa-jwt')
const { secret } = require('../config')

// 认证中间件
// const auth = async (ctx, next) => {
//   const { authorization = '' } = ctx.request.header
//   const token = authorization.replace('Bearer ', '')
//   try {
//     const user = jsonwebtoken.verify(token, secret) // 验证是否被篡改，并获取有效载荷
//     ctx.state.user = user
//   } catch (error) {
//     ctx.throw(401, error.message)
//   }
//   await next()
// }
const auth = jwt({ secret })

const router = new Router({ prefix: '/users' })

router.get('/', find)

router.post('/', create)

router.get('/:id', findById)

router.patch('/:id', auth, checkOwner, update)  // put 整体修改，patch 只修改一部分

router.delete('/:id', auth, checkOwner, del)

router.post('/login', login)

router.get('/:id/following', listFollowing)

router.get('/:id/followers', listFollowers)

router.put('/following/:id', auth, checkUserExist, follow)

router.delete('/following/:id', auth, checkUserExist, unfollow)

router.get('/:id/followingTopics', listFollowingTopics)

router.put('/followingTopics/:id', auth, checkTopicExist, followTopic)

router.delete('/followingTopics/:id', auth, checkTopicExist, unfollowTopic)

router.get('/:id/questions', listQuestions)

router.get('/:id/likingAnswers', listLikingAnswers)

router.put('/likingAnswers/:id', auth, checkAnswerExist, likeAnswer, undislikeAnswer)

router.delete('/likingAnswers/:id', auth, checkAnswerExist, unlikeAnswer)

router.get('/:id/dislikingAnswers', listDislikingAnswers)

router.put('/dislikingAnswers/:id', auth, checkAnswerExist, dislikeAnswer, unlikeAnswer)

router.delete('/dislikingAnswers/:id', auth, checkAnswerExist, undislikeAnswer)

router.get('/:id/collectingAnswer', listCollectingAnswers)

router.put('/collectingAnswer/:id', auth, checkAnswerExist, collectAnswer)

router.delete('/collectingAnswer/:id', auth, checkAnswerExist, uncollectAnswer)

module.exports = router