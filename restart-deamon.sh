#!/bin/bash

if [[ $(launchctl list | grep iCloudPhotoBackupFlickr) ]]; then
  launchctl unload ~/Library/LaunchAgents/com.github.jmblog.iCloudPhotoBackupFlickr.plist
fi

launchctl load ~/Library/LaunchAgents/com.github.jmblog.iCloudPhotoBackupFlickr.plist