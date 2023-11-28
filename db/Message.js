const { v4: uuidv4 } = require('uuid');

const Message = class Message{
    constructor(message){
        this.id = uuidv4()
        this.date = Date.now();
        this.type = null
        this.message = message
    }
}

module.exports = Message