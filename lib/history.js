'use strict';

var fs = require('fs');

exports.historyDir = __dirname + '/../history';

exports.exists = function(key) {
  if (typeof key === 'string' && key !== '') {
    return fs.existsSync(exports.historyDir + '/' + key);
  } else {
    throw new Error("key is invalid");
  }
};

exports.append = function(key, callback) {
  if (exports.exists(key)) {
    callback(new Error('key already exists'));
  } else {
    fs.mkdir(exports.historyDir + '/' + key, function(err) {
      if (err) {
        callback(err);
      } else {
        callback(null, true);
      }
    });
  }
};

exports.remove = function(key, callback) {
  if (!exports.exists(key)) {
    callback(new Error('key does not exists'));
  } else {
    fs.rmdir(exports.historyDir + '/' + key, function(err) {
      if (err) {
        callback(err);
      } else {
        callback(null, true);
      }
    });
  }
};