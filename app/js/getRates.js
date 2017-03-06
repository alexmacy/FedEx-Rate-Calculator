const d3 = require('d3');
const fs = require('fs');
const Fedex = require('./fedex-src');

const margin = getJSON('credentials.json').Margin;
const OriginationZIP = getJSON('credentials.json').Origination_ZIP_Code;
const boxSpecs = getJSON('box-specs.json');

const getRate = (specs, callback) => {
  Fedex.addressvalidation(
    {
      AddressesToValidate: [
        {
          Address: {
            StreetLines: [specs.address],
            City: specs.city,
            StateOrProvinceCode: specs.state,
            PostalCode: specs.zip,
            CountryCode: 'US'
          }
        }
      ]
    }, 
    (err, response) => {
      if(err) {return alert(err);}
      if (response.HighestSeverity != "SUCCESS") {
        return alert(JSON.stringify(response.Notifications))
      }

      const classification = response.AddressResults[0].Classification;
      const shipDate = d3.timeParse('%Y-%m-%d')(specs.shipDate);

      Fedex.rates(
        {
          ReturnTransitAndCommit: true,
          CarrierCodes: ['FDXE','FDXG'],
          RequestedShipment: {
            ShipTimestamp: shipDate.toISOString(),
            DropoffType: 'REGULAR_PICKUP',
            PackagingType: 'YOUR_PACKAGING',
            Shipper: {
              Address: {
                PostalCode: OriginationZIP,
                CountryCode: 'US'
              }
            },
            Recipient: {
              Address: {
                PostalCode: specs.zip,
                CountryCode: 'US',
                Residential: classification == 'RESIDENTIAL'
              }
            },
            PackageCount: '1',
            RequestedPackageLineItems: {
              SequenceNumber: 1,
              GroupPackageCount: 1,
              Weight: {
                Units: 'LB',
                Value: boxSpecs[specs.bc].weight
              },
              Dimensions: {
                Length: boxSpecs[specs.bc].length,
                Width: boxSpecs[specs.bc].width,
                Height: boxSpecs[specs.bc].height,
                Units: 'IN'
              },
              SpecialServicesRequested: {
                SpecialServiceTypes: 'SIGNATURE_OPTION',
                SignatureOptionDetail: {
                  OptionType: specs.alcohol ? 'ADULT' : 'SERVICE_DEFAULT'
                }
              }
            }
          }
        }, 
        function(err, res2) {
          if (err || !res2) return alert(err)
          if (response.HighestSeverity != "SUCCESS") {
            return alert(JSON.stringify(response.Notifications))
          }

          const rates = res2.RateReplyDetails.reverse()
          const rateArray = [];

          const dateParse = d3.timeParse('%Y-%m-%dT%H:%M:%S.%LZ');
          const dateFormat = d3.timeFormat('%a, %m/%d %I:%M %p');

          for (i=0; i<rates.length; i++) {
            const thisRate = {
              ServiceType: cleanText(rates[i].ServiceType)
            }

            if (rates[i].DeliveryTimestamp) {
              thisDate = rates[i].DeliveryTimestamp;
              thisRate.DeliveryDate = dateFormat(dateParse(thisDate.toISOString()));
            } else {
              thisRate.DeliveryDate = cleanText(rates[i].TransitTime);
            };

            const amount = +rates[i].RatedShipmentDetails[0]
                          .ShipmentRateDetail.TotalNetCharge.Amount;
          
            const adjusted = amount * margin + boxSpecs[specs.bc].handling;
            
            thisRate.Amount = d3.format('$,.0f')(Math.ceil(adjusted));

            rateArray.push(thisRate)
          }

          return callback(rateArray, cleanText(classification))
        }
      );
    }
  );
};


function cleanText(textToClean) {
  const splitWords = textToClean.toLowerCase().split('_');
  for (n=0; n<splitWords.length; n++) {
    if (splitWords[n].length > 1) {
      splitWords[n] = `${splitWords[n][0].toUpperCase()}${splitWords[n].slice(1)}`;
    }
  }
  return splitWords.join(' ').replace(/Am/g, 'AM').replace(/Pm/g, 'PM')
}

function getJSON(filePath) {
  return JSON.parse(fs.readFileSync(`${__dirname}/../../settings/json/${filePath}`, 'utf8'))
}

module.exports = getRate;