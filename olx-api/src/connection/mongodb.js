const mongoose = require('mongoose')

function connection() {
    mongoose.connect(process.env.DATABASE, (err) => {
        if(err){
            console.log(err)
        }else{
            console.log("Connected successfully on mongodb")
        }
    })
}

module.exports = connection