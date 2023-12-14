const db = require('../../db/db')

const categoryCount = () => {
  const data = {

    message: db.messages.filter(message => message.type === 'message').length,
    video: db.messages.filter(message => message.type.startsWith('video')).length,
    audio: db.messages.filter(message => message.type.startsWith('audio')).length,
    image: db.messages.filter(message => message.type.startsWith('image')).length,
    other: db.messages.filter(message => message.type === 'other').length
  }
  return data
}

module.exports = categoryCount
