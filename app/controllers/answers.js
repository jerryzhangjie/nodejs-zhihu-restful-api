const Answer = require('../models/answers')

class AnswersCtl {
  async find(ctx) {
    const { per_page = 2 } = ctx.query
    const page = Math.max(ctx.query.page * 1, 1) - 1
    const perPage = Math.max(per_page * 1, 1)
    const q = new RegExp(ctx.query.q) // 使用mongoose的正则语法糖实现模糊搜索
    ctx.body = await Answer
      .find({ content: q, questionId: ctx.params.questionId })  // 使用mongoose的$or语法实现既可以按title又可以按description模糊匹配
      .limit(perPage) // 每页几条数据
      .skip(page * perPage) // 跳过前多少条，即控制显示第几页
  }

  async checkAnswerExist(ctx, next) {
    const answer = await Answer.findById(ctx.params.id).select('+answerer')
    if (!answer) { ctx.throw(404, '答案不存在') }
    // 只有删改查答案时才检查该逻辑，赞、踩答案时不检查
    if (ctx.params.questionId && answer.questionId !== ctx.params.questionId) {
      ctx.throw(404, '该问题下没有此答案')
    }
    ctx.state.answer = answer
    await next()
  }

  async findById(ctx) {
    const { fields = '' } = ctx.query
    const selectField = fields.split(';').filter(f => f).map(f => ' +' + f).join('')
    const answer = await Answer
      .findById(ctx.params.id) 
      .select(selectField)
      .populate('answerer')
    if (!answer) { ctx.throw(404, '答案不存在') }
    ctx.body = answer
  }

  async create(ctx) {
    ctx.verifyParams({
      content: { type: 'string', required: true },
    })
    const answerer = ctx.state.user._id
    const questionId = ctx.params.questionId
    const answer = await new Answer({...ctx.request.body, answerer, questionId}).save()
    ctx.body = answer
  }

  async checkAnswerer(ctx, next) {
    const { answer } = ctx.state
    if (answer.answerer.toString() !== ctx.state.user._id) { ctx.throw(403, '没有权限') }
    await next()
  }

  async update(ctx) {
    ctx.verifyParams({
      content: { type: 'string', required: false },
    })
    await ctx.state.answer.update(ctx.request.body)
    ctx.body = ctx.state.answer
  }

  async delete(ctx) {
    await Answer.findByIdAndRemove(ctx.params.id)
    ctx.status = 204
  }
}

module.exports = new AnswersCtl()