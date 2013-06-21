#!/usr/bin/env node

'use strict';

var fs = require('fs'),
    path = require('path'),
    _ = require('lodash'),
    confy = require('confy'),
    colors = require('colors'),
    Flickr = require('flickr-with-uploads').Flickr,
    history = require('./lib/history');

// Synced files by iCloud Photo Stream are put in this directory.
var icloud_dir = process.env['HOME'] + '/Library/Application\ Support/iLifeAssetManagement/assets/sub';

confy.get('icloud-photo-backup-flickr', function(err, conf) {
  if (err) {
    console.error('Error: ' + err);
    process.exit(1);
  } else if (_.find([conf.api_key, conf.api_secret, conf.access_token, conf.access_token_secret], function(c) { return c === undefined; })) {
    console.error('Error: Missing confidential key(s). Run this script first:\n\n');
    console.error('  node auth-flickr.js\n'); 
    process.exit(1);
  } else {
    var photos = []; 
    var client = new Flickr(conf.api_key, conf.api_secret, conf.access_token, conf.access_token_secret);
    var hashKeys = _.filter(fs.readdirSync(icloud_dir), function(dir) { return !history.exists(dir);});
    
    _.forEach(hashKeys, function(hkey) {
      var photo = _.filter(fs.readdirSync(path.join(icloud_dir, hkey)), function(file) { return file !== '.DS_Store'; })[0];
      if (photo !== undefined) {
        photos.push({ hkey: hkey, filename: photo });
      }
    });
    
    photos.sort(function(a, b) {
      if (a.filename > b.filename) {
        return 1;
      } else {
        return -1;
      }
    });
    
    if (photos.length) {
      console.log('Start uploading photos...');
      console.log(photos.length + ' files are being uploaded'); 
      uploadFiles(client, photos, photos.length);
    }
  }
});
    
function uploadFiles(client, photos, total) {
  var params = {},
      photo = photos.shift(),
      cnt = total - photos.length;
  
  if (photo !== undefined) {
    console.log('(' + cnt + '/' + total + ') Uploading... ' + photo.hkey + '/' + photo.filename);
    params = { photo: fs.createReadStream(path.join(icloud_dir, photo.hkey, photo.filename), { flags: 'r' }) };
    api('upload', params, function(err, response) {
      if (err) {
        console.error(err);
      } else {
        console.log('Done');
        history.append(photo.hkey, function(err, res) {
          if (err) {
            console.error(err);
          }
          uploadFiles(client, photos, total);
        });
      }
    });
  }
  function api(method_name, data, callback) {
    return client.createRequest(method_name, data, true, callback).send();
  }
}