const ping = require('ping');
const dataHandler = require('../utils/dataHandler');

const hosts = [
  {value: '8.8.8.8', name: 'Google DNS' },
  {value: 'google.com', name: 'Google' },
  {value: 'facebook.com', name: 'Facebook' }
];

module.exports = function runPing() {
  return Promise.all(hosts.map(({value, name}) => {
      return ping.promise.probe(value, {
        extra: ['-c 10']
      }).then(({min, max, avg, alive}) => (
        {value, name, min, max, avg, alive}
      ))
  })).then((result) => {
    dataHandler('ping', JSON.stringify(Object.assign({ts: new Date()}, {pings: result})));
  });
}
