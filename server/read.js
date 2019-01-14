const fs = require('fs');

module.exports = {
  ping,
  speedtest
}

function ping () {
  return new Promise((resolve, reject) => {
    fs.readFile(__dirname + '/../data/ping', (err, data) => {
      if (err) return reject(err);
      resolve(data.toString().split('\n').map(JSON.parse).reduce((pre, {ts, pings}) => pre.concat(pings.map((p) => ({...p, ts}))), []).reduce((pre, cur) => ({ ...pre, [cur.name]: pre[cur.name] ? pre[cur.name].concat(cur) : [cur] }), {}));
    });
  });
}

function speedtest () {
  return new Promise((resolve, reject) => {
    fs.readFile(__dirname + '/../data/speedtest', (err, data) => {
      if (err) return reject(err);
      resolve(data.toString().split('\n').map(JSON.parse));
    });
  });
}
