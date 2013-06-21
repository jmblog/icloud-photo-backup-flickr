# icloud-photo-backup-flickr

A tool to back up iCloud Photo Stream to Flickr for Mac OS X

## Requirements

* Node.js
* Flickr account

## Initialization

Clone this sources to your Mac. The target directory is anywhere you want.

	$ mkdir ~/Library/iCloudPhotoBackupFlickr
	$ cd ~/Library/iCloudPhotoBackupFlickr
	$ git clone git@github.com:jmblog/icloud-photo-backup-flickr.git .
	$ npm install

Next, you must give permission to this tool to upload photos on your Flickr account. Run this script:

	$ node auth-flickr.js

Your confidential keys are stored in `~/.confy`.

## Running backup script

	$ node backup-flickr.js

Photos in `~/Library/Application Support/iLifeAssetManagement/assets/sub` are uploaded to Flickr. Once uploaded successfully, same photos are not uploaded again.

## Automatic backup

You can back up automatically when iCloud has downloaded new photos to your Mac.

### Launching a deamon

First, Prepare a plist file with this script.

	$ node create-plist.js

`com.github.jmblog.iCloudPhotoBackupFlickr.plist` is created in your install directory.

Put this file to `~/Library/LaunchAgents`. A symbolic link would be better than copying.

	$ ln -s $(pwd)/com.github.jmblog.iCloudPhotoBackupFlickr.plist ~/Library/LaunchAgents/

Load a deamon with launchd.

	$ launchctl load ~/Library/LaunchAgents/com.github.com.jmblog.iCloudPhotoBackupFlickr.plist

Check whether the deamon was loaded successfully.

	$ launchctl list | grep 'iCloudPhotoBackupFlickr'

### Run PhotoStreamAgent.app

Usually, iCloud Photo Stream syncs only when iPhoto or Aperture is opened. But with running `PhotoStreamAgent` in the background, you can download new photos without opening iPhoto or Aperture.

	$ open /Applications/iPhoto.app/Contents/Library/LoginItems/PhotoStreamAgent.app

And I recommend Adding PhotoStreamAgent to the login items.

	$ osascript -e 'tell application "System Events" to make login item at end with properties {path:"/Applications/iPhoto.app/Contents/Library/LoginItems/PhotoStreamAgent.app", hidden:false, name:"PhotoStreamAgent"}'

Now, the setup is done. Try take a photo with a device running iCloud (e.g. iPhone).

### Stopping the deamon

	$ launchctl unload ~/Library/LaunchAgents/com.github.com.jmblog.iCloudPhotoBackupFlickr.plist

### Checking Log

You can see logs with Console.app. 

	$ open /Applications/Utilities/Console.app

## TODO

* Push notification when a uploading process has finished.

## License
Copyright (c) 2013 Yoshihide Jimbo  
Licensed under the MIT license.
