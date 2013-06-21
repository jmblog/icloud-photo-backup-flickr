'use strict';

var history = require('../lib/history.js'),
    testCase = require('nodeunit').testCase,
    fs = require('fs');

history.historyDir = __dirname + '/history';

var uploaded = '01036744f8c5e328462a5f3f26dffa8a5c517ed42a',
    not_uploaded = '0167ea5be4cce3b01f2651f068e3e77b9312e57f82';

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

module.exports = testCase({
  setUp: function(callback) {
    if (!fs.existsSync(history.historyDir + '/' + uploaded)) {
      fs.mkdirSync(history.historyDir + '/' + uploaded);
    }
    callback();
  },
  tearDown: function(callback) {
    [uploaded, not_uploaded].forEach(function(dir) {
      if (fs.existsSync(history.historyDir + '/' + dir)) {
        fs.rmdirSync(history.historyDir + '/' + dir);
      }
    });
    callback();
  },
  'exists': testCase({
    'already exist': function(test) {
      console.log(history.exists(uploaded));
      test.strictEqual(history.exists(uploaded), true, 'return true');
      test.done();
    },
    'not yet': function(test) {
      test.strictEqual(history.exists(not_uploaded), false, 'return true');
      test.done();
    },
    'exists invalid key': function(test) {
      test.throws(
        function() {
          history.exists(null);
        },
        Error, 
        'null'
      );
      test.throws(
        function() {
          history.exists(undefined);
        },
        Error, 
        'undefined'
      );
      test.throws(
        function() {
          history.exists('');
        },
        Error, 
        'empty string'
      );
      test.throws(
        function() {
          history.exists(-'001');
        },
        Error, 
        'number'
      );
      test.done();
    }
  }),
  "append": testCase({
    'normal case': function(test) {
      history.append(not_uploaded, function(err, res) {
        test.strictEqual(err, null, 'error is null');
        test.strictEqual(res, true, 'return true');
        test.ok(fs.existsSync(history.historyDir + '/' + not_uploaded), 'directory is created');
        test.done();
      });
    },
    'duplicated key': function(test) {
      history.append(uploaded, function(err, res) {
        test.ok(err, 'error is not null');
        test.strictEqual(res, undefined);
        test.done();
      });
    }
  }),
  "remove": testCase({
    'normal case': function(test) {
      history.remove(uploaded, function(err, res) {
        test.strictEqual(err, null, 'error is null');
        test.strictEqual(res, true, 'return true');
        test.ok(!fs.existsSync(history.historyDir + '/' + uploaded), 'directory is deleted');
        test.done();
      });
    },
    'not existed key': function(test) {
      history.remove(not_uploaded, function(err, res) {
        test.ok(err, 'error is not null');
        test.strictEqual(res, undefined);
        test.done();
      });
    }
  })
});
