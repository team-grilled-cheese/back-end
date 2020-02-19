const mongoose = require('mongoose')
// const answerSchema = require('./answer')

const answerSchema = new mongoose.Schema({
  answer: {
    type: Number,
    enum: [1, 2, 3, 4],
    required: true
  }
})

const surveySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  answer: [ answerSchema ]
},
{
  timestamps: true
})

module.exports = mongoose.model('Survey', surveySchema)
