# Pictie: Visual messaging

### Contents
- [Installation](#install)
- [Push Configuration](#push)
- [iOS provisionning](#ios_provision)

##<a name="install"></a> Installation
0. Prerequisites:
  * Node.js 
  * Npm

1. Install Cordova
  ```
  sudo npm install -g cordova
  ```

2. Clone repo from github
  ```
  git clone git@github.com:contentbird/pictie.git
  ```

3. Add Android & IOS platforms
  ```
  cd pictie
  cordova platform add ios
  cordova platform add android
  ```

4. Build and run pictie on the simulators
  ```
  cordova emulate android
  cordova emulate ios
  ```
  If you don't have iOS simulator available from command line, run this:
  ```
  npm install -g ios-sim
  ```

5. Build and run pictie on your iPhone or iPad
  Connect your device to computer using cable and
  ```
  cordova run ios
  cordova run android
  ```
  To be able de deploy you might need this:
  ```
  npm install -g ios-deploy
  ```

##<a name="push"></a> Push Notifications

### Android (GCM: Google Cloud Messaging)
1. Navigate to the [Google Cloud Messaging Getting Started Guide](http://developer.android.com/google/gcm/gs.html) and follow the instructions for __Creating a Google API Project__, __Enabling the GCM Service__, and __Obtaining an API Key__

   When creating the new key, choose Server key (and not Android key)  
   Write down the Project ID and API Key obtained.

2. Use these ProjectId as __senderId__ config key in angular PushService
   
   The API Key will be used in pictie-srv 

### iOS (APNS: Apple Push Notification Service)
 
   In order to register the client device on APNS servers, the app must be signed with a valid Provisionning Profile. It means:
  * APNS must be activated on provisionning profile
  * The app bundle identifier used when creating the cordova app (ex: com.pictie.app) must match the one of the provisonning profile _note:_  In this case, uppon registration you will see an error like "aucune autorisation 'aps environment' valide détecté pour l'application

  Go to [iOS provisonning](#ios_provision) for an explanation on how to generate and integrate a valid provisionning profile for the app.

##<a name="ios_provision"></a> iOS provisionning
