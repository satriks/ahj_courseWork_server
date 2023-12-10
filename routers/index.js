const combineRoute = require('koa-combine-routers')
const messages = require('./messages')
const filter = require('./filter')

const router = combineRoute(
  messages,
  filter
)

module.exports = router
