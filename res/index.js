/* global localStorage */
const Client = require('ssh2').Client
var IP
require('os').networkInterfaces().en0.forEach(adapter => {
  if (adapter.family === 'IPv4') {
    IP = adapter.address
  }
})

window.onload = () => {
  if (localStorage.devices) {
    let devices = JSON.parse(localStorage.devices)
    devices.forEach(device => {
      addDevice(device.host, device.username, device.password)
    })
  }
  if (localStorage.y) {
    document.getElementById('resY').value = localStorage.y
  }
  if (localStorage.x) {
    document.getElementById('resX').value = localStorage.x
  }
  if (localStorage.resize !== undefined) {
    let resize = document.getElementById('resize')
    resize.checked = (localStorage.resize === 'true')
    document.getElementById('resizeDimensions').style.display = (resize.checked) ? 'inline' : 'none'
  }
}

function addDevice (host, username, password) {
  let table = document.getElementById('devicePane')
  let row = table.insertRow(table.rows.length)
  row.insertCell(0)
  row.insertCell(1)
  row.insertCell(2)
  row.insertCell(3)
  let hostInput = document.createElement('input')
  hostInput.type = 'text'
  hostInput.classList.add('host')
  hostInput.placeholder = 'Hostname'
  if (typeof host === 'string') hostInput.value = host
  let usernameInput = document.createElement('input')
  usernameInput.type = 'text'
  usernameInput.classList.add('username')
  usernameInput.placeholder = 'Username'
  if (username) usernameInput.value = username
  let passwordInput = document.createElement('input')
  passwordInput.type = 'password'
  passwordInput.classList.add('password')
  passwordInput.placeholder = 'Password'
  if (password) passwordInput.value = password
  let connect = document.createElement('input')
  connect.type = 'button'
  connect.value = 'On'
  connect.style.backgroundColor = 'green'
  connect.onclick = function () {
    let row = this.parentElement.parentElement
    let device = {
      host: row.querySelector('.host').value,
      username: row.querySelector('.username').value,
      password: row.querySelector('.password').value,
      readyTimeout: 999999
    }
    if (device.host && device.username && device.password) piLaunch(device)
  }
  let disConnect = document.createElement('input')
  disConnect.type = 'button'
  disConnect.value = 'Off'
  disConnect.style.backgroundColor = 'orange'
  disConnect.onclick = function () {
    let row = this.parentElement.parentElement
    let device = {
      host: row.querySelector('.host').value,
      username: row.querySelector('.username').value,
      password: row.querySelector('.password').value,
      readyTimeout: 999999
    }
    if (device.host && device.username && device.password) piStop(device)
  }
  let delButton = document.createElement('input')
  delButton.type = 'button'
  delButton.value = 'Delete'
  delButton.style.backgroundColor = 'red'
  delButton.onclick = function () {
    let row = this.parentElement.parentElement
    document.getElementById('devicePane').deleteRow(row.rowIndex)
  }
  row.cells[0].appendChild(hostInput)
  row.cells[1].appendChild(usernameInput)
  row.cells[2].appendChild(passwordInput)
  row.cells[3].appendChild(connect)
  row.cells[3].appendChild(disConnect)
  row.cells[3].appendChild(delButton)
}

function saveDevices () {
  let devices = []
  let hosts = document.querySelectorAll('.host')
  let usernames = document.querySelectorAll('.username')
  let passwords = document.querySelectorAll('.password')
  for (let x = 0; x < hosts.length; x++) {
    let host = hosts[x].value
    let username = usernames[x].value
    let password = passwords[x].value
    if (host && username && password) {
      devices.push({
        host: host,
        username: username,
        password: password
      })
    }
  }
  localStorage.devices = JSON.stringify(devices)
}

function piLaunch (device) {
  let ssh = new Client()
  ssh.on('error', err => {
    console.log(err)
  })
  ssh.on('ready', function () {
    ssh.exec(`DISPLAY=:0 chromium-browser -kiosk ${IP}:3777`, function (err, stream) {
      if (err) {
        console.log(err)
      }
      stream.on('close', function (code, signal) {
        ssh.end()
      })
        .on('data', console.log)
        .stderr.on('data', console.log)
    })
  }).connect(device)
}

function piStop (device) {
  let ssh = new Client()
  ssh.on('error', err => {
    console.log(err)
  })
  ssh.on('ready', function () {
    ssh.exec('killall chromium-browser', function (err, stream) {
      if (err) {
        console.log(err)
      }
      ssh.end()
    })
  }).connect(device)
}
