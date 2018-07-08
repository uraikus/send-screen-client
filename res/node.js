/* global goodLogin, badLogin */

const { exec } = require('child_process')
const { readFileSync } = require('fs')
const resizeImg = require('resize-img')
const io = require('socket.io-client')
var resWidth = 1200
var resHeight = 800
var loggedIn = false
var socket
var cast = false

function connectServer (serverURI, serverPass) {
  socket = io(`http://${serverURI}`)
  socket.on('login', r => {
    if (r === true) {
      loggedIn = true
      goodLogin()
    } else if (r === false) {
      badLogin('Bad password.')
    }
  })
  socket.emit('login', serverPass)
}

function startScreenShare () {
  if (cast === true) return false
  cast = true
  sendImage()
}

function stopScreenShare () {
  cast = false
}

function sendImage () {
  if (cast === false || loggedIn === false) return false
  exec('screencapture -m -t jpg -x /tmp/screenshot.jpg', (err, stdout, stderr) => {
    if (err) {
      console.log(err)
      sendImage()
    } else if (stderr) {
      console.log(stderr)
      sendImage()
    } else {
      let img = readFileSync('/tmp/screenshot.jpg')
      resizeImg(img, {width: resWidth, height: resHeight})
        .then(buffer => {
          socket.emit('cast', buffer)
          sendImage()
        })
        .catch(err => {
          console.log(err)
          sendImage()
        })
    }
  })
}
