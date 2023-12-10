const Router = require('koa-router')
const db = require('../../db/db')
const router = new Router()


router.get('/messages/filter', async (ctx) => {

    console.log('get filter')
    const {filter} = ctx.query
    const filterParam = new RegExp(filter)
    ctx.response.body = {
      status: 'OK',
      timestamp: Date.now().toString(),
      messages: db.messages.filter((message) => filterParam.test(message.text) )
    }
  })


  module.exports = router