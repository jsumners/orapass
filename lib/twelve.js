'use strict';

// https://www.trustwave.com/Resources/SpiderLabs-Blog/Changes-in-Oracle-Database-12c-password-hashes/
// http://marcel.vandewaters.nl/oracle/security/password-hashes

const crypto = require('crypto');
const eleven = require('./eleven');

function hpart(username, password) {
  const hash = crypto
    .createHash('md5')
    .update(`${username.toUpperCase()}:XDB:${password}`)
    .digest('hex').toUpperCase();
  return `H:${hash}`;
}

function tpart(password) {
  function promise(resolve, reject) {
    crypto.randomBytes(16, (err, bytes) => {
      if (err) {
        return reject(err);
      }

      const salt = Buffer.concat([bytes, new Buffer('AUTH_PBKDF2_SPEEDY_KEY')]);
      const key = crypto.pbkdf2Sync(password, salt, 4096, 512, 'sha512');
      const key64 = key.slice(0, 64);
      const t = crypto.createHash('sha512')
        .update(key64).update(bytes).digest('hex').toUpperCase();
      return resolve(`T:${t}${bytes.toString('hex').toUpperCase()}`);
    });
  }

  return new Promise(promise);
}

module.exports = function twelve(username, password, r2) {
  const useR2 = (arguments.length === 3) ? r2 : true;
  const h = hpart(username, password);

  if (useR2) {
    return tpart(password)
      .then((t) => Promise.resolve(`${h};${t}`));
  }

  return eleven(password).then((s) =>
    tpart(password).then((t) => Promise.resolve(`${s};${h};${t}`))
  );
};
