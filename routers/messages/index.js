const Router = require('koa-router')
const db = require('../../db/db')
const Message = require('../../db/Message')
const router = new Router()

// get all messages
router.get('/messages', async (ctx) => {

  console.log('get messages')
  ctx.response.body = {
    status: 'OK',
    timestamp: Date.now().toString(),
    news: db.messages
  }
})

// get message detail
router.get('/message/:id', async (ctx) => {
  const id = ctx.params.id
  console.log(id);
  const message =  db.messages.find( element => element.id === id)
  ctx.response.body = {
    status: 'OK',
    message
  }
})

//create a new message
router.post('/messages', async (ctx) => {
  try {
    const { message } = ctx.request.body
    if (message) {
      db.addMessage(new Message(message))
      ctx.body = "ok, записано"
      return
    }
    console.log("not data");
    ctx.response.body = {
      status: 403,
      error : 'Not message in body'
    }
  } 
  catch (error) {
    ctx.response.body = {
      status: 403,
      error : 'Not Data'
    
    }
  }
})

//update 
router.put('/message/:id', async (ctx) => {
  const id = ctx.params.id
  const {type , message} = ctx.request.body
  const responseMessage = db.changeMessage(id,type, message)
  ctx.response.body = {
    status: 'Change',
    message: responseMessage

  }
})

//delete message
router.post('/message/:id/delete', async (ctx) => {
  const id = ctx.params.id
  const messageItem = db.deleteMessage(id)

  ctx.response.body = {
    status: 'Delete',
    messageItem
  }
})


db.addMessage(new Message("тестовое сообщение "))
db.addMessage(new Message("тестовое сообщение 2"))


module.exports = router
