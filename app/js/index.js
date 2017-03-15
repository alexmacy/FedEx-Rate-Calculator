const d3 = require('d3');
const {ipcRenderer} = require('electron')
const fs = require('fs');
const getRate = require('./js/getRates');


const shippingDays = d3.entries(getJSON('shipping-days.json'))
const bottleCounts = getJSON('bottle-counts.json');
const shipStates = getJSON('shipping-states.json');


const firstShippingDay = d3.min(shippingDays, (d, i) => d.value ? i : Infinity)

// if today is not in ShippingDays default to first Shipping Day
const shipDate = shippingDays[new Date().getDay()].value ? 
        new Date() : 
        d3[`time${shippingDays[firstShippingDay].key}`].ceil(new Date()) 


d3.select('#shipDate')
    .property('value', d3.timeFormat('%Y-%m-%d')(shipDate))

d3.select('#state').selectAll('option')
    .data(d3.keys(shipStates).filter(d => shipStates[d]))
  .enter().append('option')
    .property('value', d => d)
    .text(d => d)

d3.select('#bc').selectAll('option')
    .data(bottleCounts)
  .enter().append('option')
    .property('value', d => d.value)
    .text(d => d.label)


function navigate(a) {
  ipcRenderer.send('navigate-to', a)
}

function getJSON(filePath) {
  return JSON.parse(fs.readFileSync(`${__dirname}/../settings/json/${filePath}`, 'utf8'))
}

function rateCalc(shipmentDetails) {
  if (!shipmentDetails) {      
    shipmentDetails = {
      address: document.getElementById('address').value,
      city: document.getElementById('city').value,
      state: document.getElementById('state').value,
      zip: document.getElementById('zip').value,
      bc: document.getElementById('bc').value,
      shipDate: document.getElementById('shipDate').value,
      alcohol: document.getElementById('alcoholToggle').checked
    }
  }

  d3.select('#rate_table').html('')

  d3.select('#message')
      .style('display', null)

  getRate(shipmentDetails, buildRateTable)
};

function buildRateTable(rateData, classification) {  
  d3.select('#message')
    .style('display', 'none')

  const table = d3.select('#rate_table')

  table.append('tr')
    .append('td')
      .attr('colspan', 2)
      .style('text-align', 'right')
      .html(`(${classification} Address)`)

  for (d of rateData) {
    table.append('tr')
      .append('th')
        .attr('colspan', 2)
        .text(d.ServiceType)

    table.append('tr')
        .attr('bgcolor', '#F0FFF0')
      .selectAll('td')
        .data([d.DeliveryDate, d.Amount])
      .enter().append('td')
        .style('text-align', (p, i) => i == 0 ? 'left' : 'right')
        .text(p => p)
  }
}
