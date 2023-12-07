const { v4: uuidv4 } = require('uuid');

const Message = class Message{
    constructor(message, type = null){
        this.id = uuidv4()
        this.date = Date.now();
        this.type = type
        this.message = message
    }
}

module.exports = Message