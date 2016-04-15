'use strict';

const path = require('path');

function reqlib(name) {
  return require(path.join(__dirname, 'lib', name));
}

const ten = reqlib('ten');
const eleven = reqlib('eleven');
const twelve = reqlib('twelve');

function alterTen(username, password) {
  const hash = ten(username, password);
  return `alter user ${username} identified by values '${hash}'`;
}

function alterEleven(username, password) {
  return eleven(password).then((hash) =>
    `alter user ${username} identified by values '${hash}'`
  );
}

function alterTwelve(username, password, r2) {
  const useR2 = (arguments.length === 3) ? r2 : true;
  return twelve(username, password, useR2).then((hash) =>
    `alter user ${username} identified by values '${hash}'`
  );
}

function alterTenEleven(username, password) {
  const thash = ten(username, password);
  return eleven(password).then((hash) =>
    `alter user ${username} identified by values '${hash};${thash}'`
  );
}

function alterTenTwelve(username, password, r2) {
  const useR2 = (arguments.length === 3) ? r2 : true;
  const thash = ten(username, password);
  return twelve(username, password, useR2).then((hash) =>
    `alter user ${username} identified by values '${hash};${thash}'`
  );
}

module.exports = {
  ten, eleven, twelve,
  alterTen, alterEleven, alterTwelve,
  alterTenEleven, alterTenTwelve
};
