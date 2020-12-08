const Question = require('../models/questions')

class QuestionsCtl {
  async find(ctx) {
    const { per_page = 2 } = ctx.query
    const page = Math.max(ctx.query.page * 1, 1) - 1
    const perPage = Math.max(per_page * 1, 1)
    const q = new RegExp(ctx.query.q) // 使用mongoose的正则语法糖实现模糊搜索
    ctx.body = await Question
      .find({ $or: [{title: q}, {description: q}] })  // 使用mongoose的$or语法实现既可以按title又可以按description模糊匹配
      .limit(perPage) // 每页几条数据
      .skip(page * perPage) // 跳过前多少条，即控制显示第几页
  }

  async checkQuestionExist(ctx, next) {
    const question = await Question.findById(ctx.params.id).select('+questioner')
    if (!question) { ctx.throw(404, '问题不存在') }
    ctx.state.question = question
    await next()
  }

  async findById(ctx) {
    const { fields = '' } = ctx.query
    const selectField = fields.split(';').filter(f => f).map(f => ' +' + f).join('')
    const question = await Question
      .findById(ctx.params.id)
      .select(selectField)
      .populate('questioner topics')
    if (!question) { ctx.throw(404, '问题不存在') }
    ctx.body = question
  }

  async create(ctx) {
    ctx.verifyParams({
      title: { type: 'string', required: true },
      description: { type: 'string', required: false },
    })
    const question = await new Question({...ctx.request.body, questioner: ctx.state.user._id}).save()
    ctx.body = question
  }

  async checkQuestioner(ctx, next) {
    const { question } = ctx.state
    if (question.questioner.toString() !== ctx.state.user._id) { ctx.throw(403, '没有权限') }
    await next()
  }

  async update(ctx) {
    ctx.verifyParams({
      title: { type: 'string', required: false },
      description: { type: 'string', required: false },
    })
    await ctx.state.question.update(ctx.request.body)
    ctx.body = ctx.state.question
  }

  async delete(ctx) {
    await Question.findByIdAndRemove(ctx.params.id)
    ctx.status = 204
  }
}

module.exports = new QuestionsCtl()