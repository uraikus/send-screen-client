/* global localStorage, connectServer, startScreenShare, stopScreenShare, nw, saveDevices, addDevice */

window.addEventListener('load', () => {
  document.getElementById('loginSubmit').onclick = () => {
    let hostname = document.getElementById('loginHostname').value
    let password = document.getElementById('loginPassword').value
    localStorage.hostname = hostname
    localStorage.password = password
    connectServer(hostname, password)
  }
  document.getElementById('devicesButton').onclick = () => {
    document.getElementById('controls').style.display = 'none'
    document.getElementById('devices').style.display = 'block'
  }
  document.getElementById('controlsButton').onclick = () => {
    document.getElementById('controls').style.display = 'block'
    document.getElementById('devices').style.display = 'none'
  }
  document.getElementById('startCastButton').onclick = function () {
    document.getElementById('stopCastButton').disabled = false
    this.disabled = true
    startScreenShare()
  }
  document.getElementById('stopCastButton').onclick = function () {
    document.getElementById('startCastButton').disabled = false
    this.disabled = true
    stopScreenShare()
  }
  document.getElementById('closeButton').onclick = () => {
    nw.App.quit()
  }
  document.getElementById('saveDevices').onclick = () => {
    saveDevices()
    new Notification('Devices saved!')
  }
  document.getElementById('addDevice').onclick = addDevice
})