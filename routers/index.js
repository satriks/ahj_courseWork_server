const combineRoute = require('koa-combine-routers')
const messages = require('./messages')

const router = combineRoute(
  messages
)

module.exports = router
