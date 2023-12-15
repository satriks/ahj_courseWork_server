const Router = require('koa-router')
const db = require('../../db/db')
const Message = require('../../db/Message')
const router = new Router()
const fs = require('fs')

const port = ":7070"

// get all messages
router.get('/messages', async (ctx) => {
  console.log('get messages')
  // console.log(db.messages)
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
  console.log(id)
  const message = db.messages.find(element => element.id === id)
  ctx.response.body = {
    status: 'OK',
    message
  }
})

// create a new message
router.post('/messages', async (ctx) => {
  console.log((ctx.request.body), 'message')

  const { message, text } = ctx.request.body
  const { file } = ctx.request.files

  // console.log(file, "files");

  if (file) {
    // console.log(file, "this is a file ");

    console.log(text, 'это текст из файл ')
    let dir = 'other/text'
    if (file.mimetype.startsWith('image')) dir = './assets/pic'
    if (file.mimetype.startsWith('video')) dir = './assets/video'
    if (file.mimetype.startsWith('audio')) dir = './assets/audio'

    if (dir === 'other/text') dir = './assets/other'

    const dirPath = dir.split('/')[dir.split('/').length - 1]
    let fileName = file.originalFilename

    if (fs.readdirSync(dir).includes(fileName)) {
      fileName = Date.now() + '_' + fileName
    }
    fileName = fileName.split(' ').join('_')
    console.log(fileName, ' this is filename')
    fs.copyFile(file.filepath, dir + '/' + fileName, (err) => {
      if (err) {
        console.error(err)
      }
    })
    console.log(dir, ' this dir ')
    if (dir === './assets/other') db.addMessage(new Message(text, 'http://localhost:70/' + dirPath + '/' + fileName, 'other'))
    else { db.addMessage(new Message(text, 'http://localhost:70/' + dirPath + '/' + fileName, file.mimetype)) }
    console.log(`File created : ${fileName}`, new Date(Date.now()).toLocaleString())
    // console.log(db.messages);
    ctx.response.body = `File created : ${fileName}`
    return
  }

  try {
    if (message) {
      db.addMessage(new Message(message, null, 'message'))
      ctx.body = 'ok, записано'
      return
    }
    console.log('not data')
    ctx.response.body = {
      status: 403,
      error: 'Not message in body'
    }
  } catch (error) {
    ctx.response.body = {
      status: 403,
      error: 'Not Data'

    }
  }
})

// update
router.put('/message/:id', async (ctx) => {
  const id = ctx.params.id
  const { type, message } = ctx.request.body
  const responseMessage = db.changeMessage(id, type, message)
  ctx.response.body = {
    status: 'Change',
    message: responseMessage

  }
})

router.put('/message/:id/favorite', async (ctx) => {
  console.log('put favorite')
  const id = ctx.params.id
  const message = db.messages.find(message => message.id === id)
  if (message) {
    message.favorite = !message.favorite
    ctx.response.body = {
      status: 'Change'
    }
  } else {
    ctx.response.body = {
      status: 'invalid id message'
    }
  }
})

// delete message
router.post('/message/:id/delete', async (ctx) => {
  const id = ctx.params.id
  const messageItem = db.deleteMessage(id)

  ctx.response.body = {
    status: 'Delete',
    messageItem
  }
})

db.addMessage(new Message('тестовое сообщение ', null, 'message'))
db.addMessage(new Message('тестовое сообщение 2', null, 'message'))
db.addMessage(new Message('тестовое сообщение 3', null, 'message'))
db.addMessage(new Message('тестовое сообщение 4', null, 'message'))
db.addMessage(new Message('тестовое сообщение 5', null, 'message'))
db.addMessage(new Message('тест звука', 'http://localhost' + port + '/audio/sample-9s.mp3', 'audio'))
db.addMessage(new Message('тестовое сообщение 6', null, 'message'))
db.addMessage(new Message('тест видео', 'http://localhost' + port + '/video/sample-5s.mp4', 'video'))
db.addMessage(new Message('тест изображения', 'http://localhost' + port + '/pic/test_5.jpeg', 'image'))
db.addMessage(new Message('тестовое сообщение 7', null, 'message'))
db.addMessage(new Message('тестовое сообщение 8', null, 'message'))
db.addMessage(new Message('тест записи звука', 'http://localhost' + port + '/audio/audio.mp3', 'audio'))
db.addMessage(new Message('тест  записи видео', 'http://localhost' + port + '/video/video.mp4', 'video'))
db.addMessage(new Message('тестовое сообщение 9', null, 'message'))
db.addMessage(new Message('тестовое сообщение 10', null, 'message'))
db.addMessage(new Message('тестовое сообщение 11 с ссылкой http://my-link', null, 'message'))
db.addMessage(new Message('тестовое сообщение 12 с ссылкой https://my-link', null, 'message'))

module.exports = router
