

const db = {

  messages: [],

  addMessage (message) {
    this.messages.push(message)
  },
  
  changeMessage(id, type, message){
    const messageItem =  this.messages.find( element => element.id === id)
    if (message) messageItem.message = message
    if (type) messageItem.type = type
    return messageItem
  },

  deleteMessage(id){
    const messageItem =  this.messages.find( element => element.id === id)
    this.messages = dthisb.messages.filter( el => el != messageItem)
    return messageItem
  }

}




module.exports = db
