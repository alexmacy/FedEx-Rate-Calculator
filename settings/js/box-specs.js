const d3 = require('d3');
const {ipcRenderer} = require('electron')
const fs = require('fs');

function navigate(a) {
  ipcRenderer.send('navigate-to', a)
}

const fileName = '/json/box-specs.json';

const settings = JSON.parse(fs.readFileSync(`${__dirname}${fileName}`, 'utf8'))

const tbody = d3.select('#box-specs').select('tbody')

tbody.selectAll('tr')
    .data(d3.entries(settings))
  .enter().append('tr')
    .each(function(p, j) {

      d3.select(this).append('td')
          .html(p.key)
          
      d3.select(this).selectAll('.input')
          .data(d3.entries(p.value))
        .enter().append('td')
          .attr('class', 'input')
        .append('input')
          .attr('type', 'number')
          .style('width', '75px')
          .attr('value', d => d.value)
          .on('change', function(d) {
            settings[p.key][d.key] = +d3.select(this).property('value')
          })
    })

function updateSettings() {
  if (!confirm('Are you sure you want to change the settings?')) return;
  fs.writeFileSync(`${__dirname}${fileName}`, JSON.stringify(settings, null, 2));
  navigate('./settings/settings-main.html');
}