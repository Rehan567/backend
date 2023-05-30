const mongoose = require("mongoose")


// url ="mongodb+srv://rehanmohd042:ve4Km5TcucminqI0@rehan07.kst6pfo.mongodb.net/crud2"

const connectDB = (url) => {
    return mongoose.connect(url, {

    })
}

module.exports = connectDB;