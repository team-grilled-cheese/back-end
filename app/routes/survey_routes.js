// Express docs: http://expressjs.com/en/api.html
const express = require('express')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')

// pull in Mongoose model for examples
const Survey = require('../models/survey')

// this is a collection of methods that help us detect situations when we need
// to throw a custom error
const customErrors = require('../../lib/custom_errors')

// we'll use this function to send 404 when non-existant document is requested
const handle404 = customErrors.handle404
// we'll use this function to send 401 when a user tries to modify a resource
// that's owned by someone else
const requireOwnership = customErrors.requireOwnership

// this is middleware that will remove blank fields from `req.body`, e.g.
// { example: { title: '', text: 'foo' } } -> { example: { text: 'foo' } }
const removeBlanks = require('../../lib/remove_blank_fields')
// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `req.user`
const requireToken = passport.authenticate('bearer', { session: false })

// instantiate a router (mini app that only handles routes)
const router = express.Router()

// Create route
router.post('/surveys', requireToken, (req, res, next) => {
  req.body.survey.owner = req.user.id

  Survey.create(req.body.survey)
    .then(survey => {
      res.status(201).json({ survey: survey.toObject() })
    })
    .catch(next)
})

// Index route
router.get('/surveys', (req, res, next) => {
  Survey.find()
    .then(surveys => {
      return surveys.map(survey => survey.toObject())
    })
    .then(surveys => res.status(200).json({ surveys: surveys }))
    .catch(next)
})

// Show route
router.get('/surveys/:id', (req, res, next) => {
  Survey.findById(req.params.id)
    .then(handle404)
    .then(survey => res.status(200).json({ survey: survey.toObject() }))
    .catch(next)
})

// Update route
router.patch('/surveys/:id', requireToken, removeBlanks, (req, res, next) => {
  delete req.body.survey.owner

  Survey.findById(req.params.id)
    .then(handle404)
    .then(survey => {
      requireOwnership(req, survey)

      return survey.updateOne(req.body.survey)
    })
    .then(() => res.sendStatus(204))
    .catch(next)
})

// DELETE
router.delete('/surveys/:id', requireToken, (req, res, next) => {
  Survey.findById(req.params.id)
    .then(handle404)
    .then(survey => {
      requireOwnership(req, survey)
      survey.deleteOne()
    })

    .then(() => res.sendStatus(204))
    .catch(next)
})

module.exports = router
