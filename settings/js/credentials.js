const d3 = require('d3');
const {ipcRenderer} = require('electron')
const fs = require('fs');
const loginDialog = require('./js/login');

function navigate(a) {
  ipcRenderer.send('navigate-to', a)
}

function loadSettings() {
  d3.select('#instructions')
      .style('display', "none")

  d3.select('#update-button')
      .style("display", null)
      .on('click', updateSettings)

  const fileName = '/json/credentials.json';
  const settings = JSON.parse(fs.readFileSync(
    `${__dirname}${fileName}`, 
    'utf8'
    ))

  d3.select('table').selectAll('tr')
      .data(d3.entries(settings))
    .enter().append('tr')
      .each(function(p, j) {

        d3.select(this).append('td')
            .attr('width', '150px')
            .html(p.key.replace(/_/g, ' ') + ': ')

        d3.select(this).append('td')
          .append('input')
            .property('value', p.value)
            .on('change', function(d) {
              settings[p.key] = d3.select(this).property('value');
            })
      })
  
  function updateSettings() {
    if (!confirm('Are you sure you want to change the settings?')) return;
    fs.writeFileSync(`${__dirname}${fileName}`, JSON.stringify(settings, null, 2));
    navigate('./settings/settings-main.html');
  }
}



    