const speedTest = require('speedtest-net');
const dataHandler = require('../utils/dataHandler');

module.exports = function runSpeedtest() {
  return new Promise((resolve, reject) => {
    const test = speedTest({maxTime: 5000});

    test.on('data', data => {
      dataHandler('speedtest', JSON.stringify(Object.assign({ts: new Date()}, data.speeds)));
      resolve();
    });

    test.on('error', reject);
  })
}
