'use strict';

const expect = require('chai').expect;
const md5 = require('md5');
const sha1 = require('sha1');
const sha512 = require('sha512');
const pbkdf2 = require('pbkdf2');
const orapass = require('../');

suite('10g');

test('hashes correctly', function tenhash(done) {
  const hash = orapass.ten('username', 'password');
  expect(hash).to.equal('872805F3F4C83365');
  done();
});

suite('11g');

test('hashes correctly', function elevenhash(done) {
  orapass
    .eleven('password')
    .then((hash) => {
      const salt = new Buffer(hash.substr(-20), 'hex');
      const buffer = Buffer.concat([new Buffer('password'), salt]);
      const testHash = sha1(buffer);
      expect(hash).to.equal(`S:${testHash}${salt.toString('hex')}`.toUpperCase());
      done();
    })
    .catch(done);
});

suite('12c');

test('hashes for release 1', function twelver1(done) {
  orapass
    .twelve('username', 'password', false)
    .then((result) => {
      const parts = result.split(';');

      const sSalt = new Buffer(parts[0].substr(-20), 'hex');
      const sBuffer = Buffer.concat([new Buffer('password'), sSalt]);
      const sHash = sha1(sBuffer);
      const sPart = `S:${sHash}${sSalt.toString('hex')}`.toUpperCase();
      expect(parts[0]).to.equal(sPart);

      const hPart = md5(`USERNAME:XDB:password`).toUpperCase();
      expect(parts[1]).to.equal(`H:${hPart}`);

      const tBytes = new Buffer(parts[2].substr(-32), 'hex');
      const tSalt = Buffer.concat([tBytes, new Buffer('AUTH_PBKDF2_SPEEDY_KEY')]);
      const tKey = pbkdf2.pbkdf2Sync('password', tSalt, 4096, 512, 'sha512');
      const tKey64 = tKey.slice(0, 64);
      const tPart = sha512(Buffer.concat([tKey64, tBytes]));
      const t = `T:${tPart.toString('hex')}${tBytes.toString('hex')}`.toUpperCase();
      expect(parts[2]).to.equal(t);

      done();
    });
});

test('hashes for release 2', function twelver1(done) {
  orapass
    .twelve('username', 'password')
    .then((result) => {
      const parts = result.split(';');

      const hPart = md5(`USERNAME:XDB:password`).toUpperCase();
      expect(parts[0]).to.equal(`H:${hPart}`);

      const tBytes = new Buffer(parts[1].substr(-32), 'hex');
      const tSalt = Buffer.concat([tBytes, new Buffer('AUTH_PBKDF2_SPEEDY_KEY')]);
      const tKey = pbkdf2.pbkdf2Sync('password', tSalt, 4096, 512, 'sha512');
      const tKey64 = tKey.slice(0, 64);
      const tPart = sha512(Buffer.concat([tKey64, tBytes]));
      const t = `T:${tPart.toString('hex')}${tBytes.toString('hex')}`.toUpperCase();
      expect(parts[1]).to.equal(t);

      done();
    });
});
