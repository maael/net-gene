const fs = require('fs');

const path = __dirname + '/../../data/';

module.exports = function (file, line) {
  let existing = '';
  try {
    existing = fs.readFileSync(`${path}${file}`)
  } catch (e) {
    console.error(e);
  }
  fs.writeFileSync(`${path}${file}`, existing.toString().split('\n').filter(Boolean).slice(-1000).concat(line).join('\n'));
};

