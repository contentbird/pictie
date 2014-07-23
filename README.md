# Pictie: Visual messaging
1- Install Cordova
```
> you need node and npm installed
> sudo npm install -g cordova
```
2- si pas de simulateur en ligne de commande ios : 
```
> npm install -g ios-sim
```
3- Git clone contentbird/pictie from github
4- build and run pictie on the ios simulator
```
> cd pictie
> cordova platform add ios
> cordova build
> cordova emulate ios
```
5- run pictie on your iphone, ipad, etc : connect your device to computer
```
> npm install -g ios-deploy
> cordova run ios
```
