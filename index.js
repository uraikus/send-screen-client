const screenshot = require('screenshot-desktop')
const resizeImg = require('resize-img')
const io = require('socket.io-client')
const serverPass = process.argv[2]
const serverURI = process.argv[3] || 'http://localhost'
const refreshRate = parseInt(process.argv[4]) || 200
const resWidth = parseInt(process.argv[5]) || 1024
const resHeight = parseInt(process.argv[6]) || 768

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
  screenshot.listDisplays().then((displays) => {
    screenshot({ screen: displays[displays.length - 1].id })
      .then((img) => {
        resizeImg(img, {width: resWidth, height: resHeight})
          .then(buffer => {
            socket.emit('cast', buffer)
            setTimeout(sendImage, refreshRate)
          })
          .catch((err) => {
            console.log(err)
            setTimeout(sendImage, refreshRate)
          })
      })
  }).catch((err) => {
    console.log(err)
    setTimeout(sendImage, refreshRate)
  })
}
