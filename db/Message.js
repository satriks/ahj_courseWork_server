const { v4: uuidv4 } = require('uuid');

const Message = class Message{
    constructor(text ,file = null, type = null){
        this.id = uuidv4()
        this.date = Date.now();
        this.type = type
        this.file = file
        this.text = text
    }
}

module.exports = Message