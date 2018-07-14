/* global io */

const { exec } = require('child_process')
const { readFileSync, unlink } = require('fs')
const resizeImg = require('resize-img')
var cast = false

function startScreenShare () {
  if (cast === true) return false
  cast = true
  sendImage()
}

function stopScreenShare () {
  cast = false
}

function sendImage () {
  if (cast === false) {
    unlink('./screenshot.jpg', console.log)
    return false
  }
  exec('screencapture -m -t jpg -x ./screenshot.jpg', (err, stdout, stderr) => {
    if (err) {
      console.log(err)
      sendImage()
    } else if (stderr) {
      console.log(stderr)
      sendImage()
    } else {
      let img = readFileSync('./screenshot.jpg')
      let resWidth = parseInt(document.getElementById('resX').value)
      let resHeight = parseInt(document.getElementById('resY').value)
      resizeImg(img, {width: resWidth, height: resHeight})
        .then(buffer => {
          let uri = `data:image/jpg;base64,${encode(buffer)}`
          io.emit('image', uri)
          sendImage()
        })
        .catch(err => {
          console.log(err)
          sendImage()
        })
    }
  })
}

function encode (input) {
  var keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
  var output = ''
  var chr1, chr2, chr3, enc1, enc2, enc3, enc4
  var i = 0

  while (i < input.length) {
    chr1 = input[i++]
    chr2 = i < input.length ? input[i++] : Number.NaN // Not sure if the index
    chr3 = i < input.length ? input[i++] : Number.NaN // checks are needed here

    enc1 = chr1 >> 2
    enc2 = ((chr1 & 3) << 4) | (chr2 >> 4)
    enc3 = ((chr2 & 15) << 2) | (chr3 >> 6)
    enc4 = chr3 & 63

    if (isNaN(chr2)) {
      enc3 = enc4 = 64
    } else if (isNaN(chr3)) {
      enc4 = 64
    }
    output += keyStr.charAt(enc1) + keyStr.charAt(enc2) +
                  keyStr.charAt(enc3) + keyStr.charAt(enc4)
  }
  return output
}
