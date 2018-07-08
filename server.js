const express = require('express')
const app = express()
app.use(express.static('public'))
const http = require('http').Server(app)
const io = require('socket.io')(http)

http.listen(3777)
