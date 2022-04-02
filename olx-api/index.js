require('dotenv').config()
const express = require('express')
const connection = require('./src/connection/mongodb')
const cors = require('cors')
const fileupload = require('express-fileupload')

// routes

connection()

const server = express()

server.use(cors())
server.use(express.json())
server.use(express.urlencoded({ extended: true }))
server.use(fileupload())

server.use(express.static(__dirname+'/public'))

server.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', "*")
    server.use(cors())
    next()
})

//server.use('/api', routes)

server.get('/ping', (req, res) => {
    res.json({ pong: true })
})

server.use((req, res) => {
    res.status(404)
    res.json({message: 'url não encontrada'})
})

server.listen(process.env.PORT, () => {
    console.log(`Server running on ${process.env.BASE}`)
})
