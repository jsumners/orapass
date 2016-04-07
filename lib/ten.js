'use strict';

// http://blog.contractoracle.com/2009/07/script-to-generate-oracle-password.html

const crypto = require('crypto');

function formatCredentials(username, password) {
  const combined = `${username}${password}`.toUpperCase();
  const targetLen = (function getLen() {
    let res = combined.length * 2;
    while (res % 8 > 0) {
      res += 1;
    }
    return res;
  }());
  const buffer = new Buffer(targetLen).fill(0x00);

  let pos = 0;
  for (const c of combined) {
    pos += buffer.write(`\u0000${c}`, pos);
  }

  return buffer;
}

module.exports = function ten(username, password) {
  const formatedCreds = formatCredentials(username, password);

  const initialKey = new Buffer([0x01, 0x23, 0x45, 0x67, 0x89, 0xAB, 0xCD, 0xEF]);
  const iv = new Buffer(8).fill(0x00);
  const enc1 = crypto.createCipheriv('des-cbc', initialKey, iv);
  enc1.setAutoPadding(false);
  const res1 = Buffer.concat([enc1.update(formatedCreds), enc1.final()]);

  const enc2 = crypto.createCipheriv('des-cbc', res1.slice(-8), iv);
  enc2.setAutoPadding(false);
  const res2 = Buffer.concat([enc2.update(formatedCreds), enc2.final()]);

  return res2.slice(-8).toString('hex').toUpperCase();
};
