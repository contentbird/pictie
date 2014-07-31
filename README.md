# Pictie: Visual messaging

### Contents
- [Installation](#install)
- [Push Notifications](#push)
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
  * The app bundle identifier used when creating the cordova app (ex: com.pictie.app) must match the one of the provisonning profile _note:_  In this case, uppon registration you will see an error like "aucune autorisation 'aps environment' valide détecté pour l'application"

  Go to [iOS provisonning](#ios_provision) for an explanation on how to generate and integrate a valid provisionning profile for the app.

#### Testing iOS notifications
- Start your app and make sure connection is available
- Download and install [APN Tester](https://itunes.apple.com/us/app/apn-tester-free/id626590577?mt=12)
- Use a valid Device Token (you get a valid device token after registering the client with APNS servers)
- Use the push SSL certificate (ie: aps_development.cr)

##<a name="ios_provision"></a> iOS provisionning

1. Create an App ID
  * Log on to [Apple Developer](https://developer.apple.com/membercenter)
  * From Left Menu, in __Identifiers__ section select __App IDs__
  * Click __+__ to add an App ID
    * Set name to __Pictie__
    * Select __Explicit App ID__
    * Set __Bundle ID__ to __com.pictie.app__ (this must match the bundle indentifier given at cordova app creation time, for iOS notification to work).
    * Enable __Push Notification__ service

2. Create an APNS Enabled Certificate 
  * Log on to [Apple Developer](https://developer.apple.com/membercenter)
  * Go to __Certificates, Identifiers & Profiles__ and click __Certificates__
  * Click __+__ to add a Certificate
    * Choose __Apple Push Notification Service SSL (Sandbox)__
    * Select the previously created Pictie AppID
    * For the CSR either use previously created CSR for the team located in the vault or generate a new one following the given howto.
    * Upload the .certSigningRequest file
    * Download the generated __Apple Development iOS Push Services: com.pictie.app__ .cer certificate and store it in the vault.

3. Create an iOS App Development Certificate 
  * Follow the above steps for an APNS Enabled Certificate except you choose __iOS App Development__ instead of __Apple Push Notification Service SSL (Sandbox)__ to generate the __iOS Development: Sebastien Neusch__ .cer file

4. Register Dev Devices
  * Log on to [Apple Developer](https://developer.apple.com/membercenter)
  * Go to __Certificates, Identifiers & Profiles__ and click __Devices__
  * Click __+__ to add a Certificate
    * Give device a name ex (iPad NNA)
    * Fill in UDID (follow instructions from [WhatsMyUdid](http://whatsmyudid.com/))

5. Create a provisioning profile
  * Log on to [Apple Developer](https://developer.apple.com/membercenter)
  * * Go to __Certificates, Identifiers & Profiles__ and click __Provisionning Profiles__
  * Now click on the __Provisioning Profiles__ section
  * Click __+__ to add a provisionning profile
    * Choose iOS App Development
    * Select Pictie App ID
    * Select previously created __Sebastien Neusch (iOS Development)__ certificate
    * Select all Devices you want to deploy your app on
    * Give it a name (suggeestion: use this pattern pictie_<dev|adhoc|appstore>_profile)
    * Download and store in the vault

Some useful links : 
  - [APNS Tutorial](http://ameyashetti.wordpress.com/2009/07/31/apple-push-notification-service-tutorial/)
  - [Getting everything for building iOS apps](https://coderwall.com/p/eceasa)
  - [Push Notification Service iOS6](http://www.raywenderlich.com/32960/apple-push-notification-services-in-ios-6-tutorial-part-1)
