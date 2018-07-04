const { exec } = require('child_process')
const { readFileSync } = require('fs')
const resizeImg = require('resize-img')
const io = require('socket.io-client')
const serverPass = process.argv[2]
const serverURI = process.argv[3] || 'http://localhost'
const resWidth = parseInt(process.argv[4]) || 1366
const resHeight = parseInt(process.argv[5]) || 758

var socket = io(serverURI)
socket.emit('login', serverPass)

socket.on('login', r => {
  if (r === 'true') {
    sendImage()
    console.log('Good login! Now sending...')
  } else {
    console.log('Bad login')
    process.exit()
  }
})

function sendImage () {
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
