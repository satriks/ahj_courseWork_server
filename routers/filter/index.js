const Router = require('koa-router')
const db = require('../../db/db')
const router = new Router()
const categoryCount = require('../../components/category/category')


router.get('/messages/filter', async (ctx) => {

    console.log('get filter')
    const {filter} = ctx.query
    const filterParam = new RegExp(filter)
    ctx.response.body = {
      status: 'OK',
      timestamp: Date.now().toString(),
      messages: db.messages.filter((message) => filterParam.test(message.text.toLowerCase()) )
    }
  })
router.get('/messages/category', async (ctx) => {

    console.log('get category')
    ctx.response.body = {
      status: 'OK',
      timestamp: Date.now().toString(),
      messages: categoryCount() 
    }
  })
router.get('/messages/category/filter', async (ctx) => {
    const {filter} = ctx.query
    console.log('get category')
    ctx.response.body = {
      status: 'OK',
      timestamp: Date.now().toString(),
      messages: db.messages.filter((message) => message.type.toLowerCase().startsWith(filter))
    }
  })


  module.exports = router

