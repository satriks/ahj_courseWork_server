const Koa = require('koa')
const { koaBody } = require('koa-body')
const { Date } = require('core-js')
const cors = require('koa2-cors')
const port = process.env.port || 7070
const app = new Koa()
const http = require('http')
const WS = require('ws')
const url = require('url')
const koaStatic = require('koa-static')
const db = require('./db/db')
app.use(cors())
app.use(koaStatic('./assets'))

const router = require('./routers')

console.log(new Date(Date.now()).toLocaleString())

app.use(koaBody({
  multipart: true
}))

const server = http.createServer(app.callback())

const wsServer = new WS.Server({
  server
})

wsServer.on('connection', (ws, req) => {
  console.log("подключение ws");

  ws.addEventListener('message', (message) => {
    const data = message.data
    if (data === "update"){
      Array.from(wsServer.clients)
        .filter(client => client.readyState === WS.OPEN)
        .forEach(client => client.send(JSON.stringify( db.messages[db.messages.length - 1])))
    }
  })

})

app.use((ctx, next) => {
  ctx.body = " Сервер работает. Но такой запрос не понимает !"
  next()
})


// app.use(slow({ delay: 15000 }))
app.use(router())

app.listen(port)
server.listen(port + 1)
console.log('listen port ' + port)


