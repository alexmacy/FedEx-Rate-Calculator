const fedexAPI = require('shipping-fedex');
const fs = require('fs');
const {ipcRenderer} = require('electron')

const credentials = getJSON('credentials.json')

if (credentials.Key.length < 1) {
  alert("Please provide a FedEx API key")
  return navigate('settings/credentials.html')
}

if (credentials.Password.length < 1) {
  alert("Please provide a FedEx API password")
  return navigate('settings/credentials.html')
}

if (credentials.Account.length < 1) {
  alert("Please provide a FedEx account number")
  return navigate('settings/credentials.html')
}

if (credentials.Meter.length < 1) {
  alert("Please provide a FedEx meter number")
  return navigate('settings/credentials.html')
}

if (credentials.Origination_ZIP_Code.length < 1) {
  alert("Please provide an origination zip code")
  return navigate('settings/credentials.html')
}

const fedex = new fedexAPI({
  environment: 'live',
  key: credentials.Key,
  password: credentials.Password,
  account_number: credentials.Account,
  meter_number: credentials.Meter,
  imperial: true
});

function getJSON(filePath) {
  return JSON.parse(fs.readFileSync(`${__dirname}/../../settings/json/${filePath}`, 'utf8'))
}

function navigate(a) {
  ipcRenderer.send('navigate-to', a)
}

module.exports = fedex;