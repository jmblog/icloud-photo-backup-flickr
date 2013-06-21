var _ = require('lodash'),
    fs = require('fs'),
    colors = require('colors');

var tmpl = fs.readFileSync('com.github.jmblog.iCloudPhotoBackupFlickr.plist.tmpl', { encoding: 'utf8' });
var content = _.template(tmpl, {
    node_path: process.execPath,
    backupjs_path: __dirname + '/backup-flickr.js',
    home_dir: process.env['HOME']
});
fs.writeFileSync('com.github.jmblog.iCloudPhotoBackupFlickr.plist', content);

console.log('Created a plist file.'.green);
