const Koa = require('koa')
const { koaBody } = require('koa-body')
const { Date } = require('core-js')
const cors = require('koa2-cors')
const port = 7070
const app = new Koa()
const http = require('http')
const WS = require('ws')
const koaStatic = require('koa-static')
const db = require('./db/db')
const websockify = require('koa-websocket');
app.use(cors())
app.use(koaStatic('./assets'))

const router = require('./routers')
const websocket = websockify(app)

console.log(new Date(Date.now()).toLocaleString())

app.use(koaBody({
  multipart: true
}))



app.use(router())

websocket.ws.use((ctx, next) => {
    ctx.websocket.on('connection', (ws, req) => {
      console.log('подключение ws')
      

    })
    ctx.websocket.on('message', (message) => {
            const data = "" + message
            if (data === 'update') {
              console.log(Array.from(websocket.ws.server.clients), "this clients")
              Array.from(websocket.ws.server.clients).forEach(client => client.send(JSON.stringify(db.messages[db.messages.length - 1])))

            }
          })

    return next(ctx)
})

app.use((ctx, next) => {
  ctx.body = ' Сервер работает. Но такой запрос не понимает !'
  next()
})




app.listen(port)
console.log('listen port ' + port)
