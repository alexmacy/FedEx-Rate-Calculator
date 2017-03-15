const fs = require('fs');
const Dialogs = require('dialogs');

const dialogs = Dialogs(opts={});

const loginFileName = './../json/login.json';
const login = JSON.parse(fs.readFileSync(
  `${__dirname}${loginFileName}`, 
  'utf8'
  ))

function loginDialog(callback) {
  getUsername();
  
  function getUsername() {
    dialogs.prompt('username', 'joe.smith@gmail.com', function(username) {
      if (username != login.username) {
        dialogs.confirm('Username not found! Try Again?', function(response) {
          if (response) getUsername()
        })  
      } else {
        getPassword();
      }
    })
  }

  function getPassword() {
    dialogs.prompt('password', function(password) {
      if (password != login.password) {
        dialogs.confirm('Incorrect password! Try Again?', function(response) {
          if (response) getPassword()
        })  
      } else {
        callback();
      }
    })    
  }
}

module.exports = loginDialog;