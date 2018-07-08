/* global localStorage, socket */

window.onload = () => {
  if (localStorage.hostname) {
    document.getElementById('loginHostname').value = localStorage.hostname
    document.getElementById('loginPassword').value = localStorage.password
  }
  if (localStorage.devices) {
    let devices = JSON.parse(localStorage.devices)
    devices.forEach(device => {
      addDevice(device.host, device.username, device.password)
    })
  }
}

function goodLogin () {
  document.getElementById('login').style.display = 'none'
  document.getElementById('controls').style.display = 'block'
}

function badLogin (err) {
  err = err || 'An unknown error occured. Check devices network connections.'
  document.getElementById('loginError').innerText = err
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
  connect.value = 'Connect'
  connect.style.backgroundColor = 'green'
  connect.onclick = function () {
    let row = this.parentElement.parentElement
    let device = {
      host: row.querySelector('.host').value,
      username: row.querySelector('.username').value,
      password: row.querySelector('.password').value
    }
    if (device.host && device.username && device.password) socket.emit('start', device)
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
