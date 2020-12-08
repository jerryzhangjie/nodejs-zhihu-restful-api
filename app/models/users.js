const mongoose = require('mongoose')

const { Schema, model } = mongoose

const userSchema = new Schema({
  __v: { type: Number, select: false },
  name: { type: String, required: true },
  password: { type: String, required: true, select: false }, // select 用于标识该字段是否可被请求
  avatar_url: { type: String }, // 头像，实际存储的是图像地址字符串
  gender: { type: String, enum: ['male', 'female'], default: 'male', required: true }, // 性别为可枚举字符串
  headline: { type: String },
  locations: { type: [{ type: Schema.Types.ObjectId, ref: 'Topic' }], select: false },  // 字符串数组
  business: { type: Schema.Types.ObjectId, ref: 'Topic', select: false },
  employments: {    // json数组
    type: [{
      company: { type: Schema.Types.ObjectId, ref: 'Topic' },
      job: { type: Schema.Types.ObjectId, ref: 'Topic' }
    }], 
    select: false
  },
  educations: {    // json数组
    type: [{
      school: { type: Schema.Types.ObjectId, ref: 'Topic' },
      major: { type: Schema.Types.ObjectId, ref: 'Topic' },
      diploma: { type: Number, enum: [1, 2, 3, 4, 5] },
      entrance_year: { type: Number },
      graduation_year: { type: Number }
    }], 
    select: false
  },
  following: {
    type: [{ type: Schema.Types.ObjectId, ref: 'User' }],   // mongoDB 的引用语法，{type: Schema.Types.ObjectId, ref: 'User'}表示数据类型为 User 的 _id
    select: false
  },
  followingTopics: {
    type: [{ type: Schema.Types.ObjectId, ref: 'Topic' }],   // mongoDB 的引用语法，{type: Schema.Types.ObjectId, ref: 'User'}表示数据类型为 Topic 的 _id
    select: false
  },
  likingAnswers: {
    type: [{ type: Schema.Types.ObjectId, ref: 'Answer' }],
    select: false
  },
  dislikingAnswers: {
    type: [{ type: Schema.Types.ObjectId, ref: 'Answer' }],
    select: false
  },
  collectingAnswers: {
    type: [{ type: Schema.Types.ObjectId, ref: 'Answer' }],
    select: false
  }
}, { timestamps: true })

module.exports = model('User', userSchema)