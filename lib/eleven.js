'use strict';

// http://marcel.vandewaters.nl/oracle/security/password-hashes

const crypto = require('crypto');

module.exports = function eleven(password) {
  function promise(resolve, reject) {
    crypto.randomBytes(10, (err, bytes) => {
      if (err) {
        return reject(err);
      }

      const toEncrypt = Buffer.concat([new Buffer(password), bytes]);
      const encrypted = crypto.createHash('sha1').update(toEncrypt).digest('hex');
      const sha1pass = `S:${encrypted}${bytes.toString('hex')}`.toUpperCase();
      return resolve(sha1pass);
    });
  }
  return new Promise(promise);
};
