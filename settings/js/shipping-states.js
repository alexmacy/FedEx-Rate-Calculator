const d3 = require('d3');
const {ipcRenderer} = require('electron')
const fs = require('fs');

function navigate(a) {
  ipcRenderer.send('navigate-to', a)
}

const fileName = '/json/shipping-states.json';

const settings = JSON.parse(fs.readFileSync(`${__dirname}${fileName}`, 'utf8'))

const rows = d3.select('#states').selectAll('div')
    .data(d3.entries(settings))
  .enter().append('div')
    .style('margin-left', '50px')
    .attr('class', 'checkbox')
  .append('label')

rows.append('input')
    .attr('type', 'checkbox')
    .property('checked', d => d.value)
    .on('change', function(d) {      
      settings[d.key] = d3.select(this).property('checked');
    })

rows.append('text')
    .text(d => d.key)

function updateSettings() {
  if (!confirm('Are you sure you want to change the settings?')) return;
  fs.writeFileSync(`${__dirname}${fileName}`, JSON.stringify(settings, null, 2));
  navigate('./settings/settings-main.html');
}