#!/usr/bin/env node

var express = require('express'),
    OAuth = require('oauth').OAuth,
    confy = require('confy'),
    colors = require('colors'),
    querystring = require('querystring'),
    exec = require('child_process').exec;

// You can apply for your own key if you don't want to use these keys. 
// http://www.flickr.com/services/api/keys/apply/
var $api_key = '46a69268644075cd23b5c1a14aee9819',
    $api_secret = '1dafabedfb36914f';

var oauth_client = new OAuth('http://www.flickr.com/services/oauth/request_token',
                             'http://www.flickr.com/services/oauth/access_token',
                             $api_key,
                             $api_secret,
                             '1.0A',
                             'http://localhost:3000/access_token',
                             'HMAC-SHA1');

var app = express();
app.use(express.cookieParser());
app.use(express.cookieSession({ secret: 'ac5364318573030ec7a800e16f800ff9' }));

app.get('/', function(req, res) {
  if (req.session.oauth_access_token === undefined) {
    res.redirect('/request_token');
  } else {
    res.redirect('/access_token');
  }
});

// 1. Get a Request Token
app.get('/request_token', function(req, res) {
  oauth_client.getOAuthRequestToken(function(err, oauth_token, oauth_token_secret, results) {
    if (err) {
      console.error('Error: '.red + err.red);
      process.exit(1);
    }
    req.session.oauth_token = oauth_token;
    req.session.oauth_token_secret = oauth_token_secret;

    // 2. Get the User's Authorization
    res.redirect('http://www.flickr.com/services/oauth/authorize?' + querystring.stringify({
      oauth_token: oauth_token,
      perms: 'write'
    }));
  });
});

// 3. Exchange the Request Token for an Access Token
app.get('/access_token', function(req, res) {
  oauth_client.getOAuthAccessToken(
    req.session.oauth_token,
    req.session.oauth_token_secret,
    req.param('oauth_verifier'),
    function(err, oauth_access_token, oauth_access_token_secret, results2) {
      if (err) {
        console.error('Error: '.red + err.red);
        process.exit(1);
      } else {
        saveAccessToken(oauth_access_token, oauth_access_token_secret, function(err, result) { 
          if (err) {
            console.error('Error: '.red + err.red);
            res.send('<h1>Failure...</h1><p>' + err + '</p>');
          } else {
            console.log('Your Access Token and Secret are stored successfully!'.green);
            console.log('Pay attention to treat these CONFIDENTIAL keys.'.red + ' If you want to check them, run this command:\n\n  ./node_modules/confy/bin/confy get icloud-photo-backup-flickr\n');
            res.send('<h1>Success!</h1><p>Close this window and go back to the terminal.</p>');
          } 
          process.exit(0);
        });
      }
    }
  );
});

var server = app.listen(3000);
console.log('listening on http://localhost:3000'.grey);
console.log('Press Ctrl+c to stop the server.'.grey);

// Open a browser
exec('open http://localhost:3000/request_token', function() {});

function saveAccessToken(oauth_access_token, oauth_access_token_secret, callback) {
  confy.set('icloud-photo-backup-flickr', {
    data: {
      api_key: $api_key,
      api_secret: $api_secret,
      access_token: oauth_access_token,
      access_token_secret: oauth_access_token_secret
    }
  }, function(err, res) {
    callback(err, res);
  });
}
