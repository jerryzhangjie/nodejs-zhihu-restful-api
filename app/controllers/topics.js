const Topic = require('../models/topics')
const User = require('../models/users')
const Question = require('../models/questions')

class TopicsCtl {
  async find(ctx) {
    const { per_page = 2 } = ctx.query
    const page = Math.max(ctx.query.page * 1, 1) - 1
    const perPage = Math.max(per_page * 1, 1)
    ctx.body = await Topic
      .find({ name: new RegExp(ctx.query.q) })  // 使用mongoose的正则语法糖实现模糊搜索
      .limit(perPage) // 每页几条数据
      .skip(page * perPage) // 跳过前多少条，即控制显示第几页
  }

  async checkTopicExist(ctx, next) {
    const topic = await Topic.findById(ctx.params.id)
    if (!topic) { ctx.throw(404, '话题不存在') }
    await next()
  }

  async findById(ctx) {
    const { fields = '' } = ctx.query
    const selectField = fields.split(';').filter(f => f).map(f => ' +' + f).join('')
    const populateStr = fields.split(';').filter(f => f).map(f => {
      if (f === 'employments') {
        return 'employments.company employments.job'
      }
      if (f === 'educations') {
        return 'educations.school educations.major'
      }
      return f
    }).join(' ')
    const topic = await Topic
      .findById(ctx.params.id)
      .select(selectField)
      .populate(populateStr)
    if (!topic) { ctx.throw(404, '话题不存在') }
    ctx.body = topic
  }

  async create(ctx) {
    ctx.verifyParams({
      name: { type: 'string', required: true },
      avatar_url: { type: 'string', required: false },
      introduction: { type: 'string', required: false },
    })
    const topic = await new Topic(ctx.request.body).save()
    ctx.body = topic
  }

  async update(ctx) {
    ctx.verifyParams({
      name: { type: 'string', required: false },
      avatar_url: { type: 'string', required: false },
      introduction: { type: 'string', required: false },
    })
    const topic = await Topic.findByIdAndUpdate(ctx.params.id, ctx.request.body)
    ctx.body = topic
  }

  // 获取关注了某个话题的用户(话题的粉丝)
  async listTopicFollowers(ctx) {
    const users = await User.find({ followingTopics: ctx.params.id })
    ctx.body = users
  }

  async listQuestions(ctx) {
    const questions = await Question.find({ topics: ctx.params.id})
    ctx.body = questions
  }
}

module.exports = new TopicsCtl()