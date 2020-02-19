const mongoose = require('mongoose')

const answerSchema = new mongoose.Schema({
  answer: {
    type: String,
    required: true
  },
  surveyRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Survey',
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
})

module.exports = mongoose.model('Answer', answerSchema)
