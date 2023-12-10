const Router = require('koa-router')
const db = require('../../db/db')
const Message = require('../../db/Message')
const router = new Router()
const fs = require('fs')

// get all messages
router.get('/messages', async (ctx) => {

  console.log('get messages')
  ctx.response.body = {
    status: 'OK',
    timestamp: Date.now().toString(),
    messages: db.messages
  }
})
router.get('/messages/last', async (ctx) => {

  console.log('get messages')
  ctx.response.body = {
    status: 'OK',
    timestamp: Date.now().toString(),
    messages: db.messages[db.messages.length - 1]
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
  console.log((ctx.request.body), "message");

  const {message , text} = ctx.request.body
  const {file} = ctx.request.files

  // console.log(file, "files");

  if (file){
    console.log(text, "это текст из файл ");
    let dir = null;
    if (file.mimetype.startsWith("image")) dir = './assets/pic'
    if (file.mimetype.startsWith("video")) dir = './assets/video'
    if (file.mimetype.startsWith("audio")) dir = './assets/audio'
    if (dir === null) dir = './assets/other'
   
    const dirPath = dir.split("/")[dir.split("/").length - 1]
    let fileName = file.originalFilename
    
      if (fs.readdirSync(dir).includes(fileName)) {
        fileName = Date.now() + '_' + fileName
      }
      fileName = fileName.split(" ").join("_")

      fs.copyFile(file.filepath, dir +"/" + fileName, (err) => {
        if (err) {
          console.error(err)
        }
      })
      db.addMessage( new Message(text, "http://localhost:7070/"+ dirPath + "/" + fileName, file.mimetype))
      console.log(`File created : ${fileName}`, new Date(Date.now()).toLocaleString())
      console.log(db.messages);
      ctx.response.body = `File created : ${fileName}`
      return
  }

  try {
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
