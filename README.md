# Pictie: Visual messaging

### Contents
- [Installation](#install)

##<a name="install"></a> Install
0- Prerequisites:
- Node.js 
- Npm

1- Install Cordova
```
sudo npm install -g cordova
```

2- Clone repo from github
```
git clone git@github.com:contentbird/pictie.git
```

3- Add Android & IOS platforms
```
cd pictie
cordova platform add ios
cordova platform add android
```

3- Build and run pictie on the simulators
```
cordova emulate android
cordova emulate ios
```
If you don't have iOS simulator available from command line, run this:
```
npm install -g ios-sim
```

5- Build and run pictie on your iPhone or iPad
Connect your device to computer using cable and
```
cordova run ios
cordova run android
```
To be able de deploy you might need this:
```
npm install -g ios-deploy
```
