# Cordova react firebase app

This app is a sample omni-channel application developped using React, Cordova and Firebase. It aims to practice the base react features and the use of multiple platforms.

The app contains 3 main packages:

- Client: the react application
- Mobile: the cordova mobile application
- Server: the express firebase application

## System Requirements

- [Git][git] v2.22.0 or greater
- [NodeJS][node] v10.15.3 or greater
- [Npm][npm] v6.9.0 or greater
- [Firebase][firebase] v7.0.2 or greater
- [Cordova][cordova] v9.0.0 or greater
- [Android SDK]

All of these must be available in your `PATH`. To verify things are set up
properly, you can run this:

```
$ git --version
$ node --version
$ npm --version
$ firebase --version
$ cordova --version
```

If you have trouble with any of these, learn more about the PATH environment
variable and how to fix it here for [windows][win-path] or
[mac/linux][mac-path].

You can follow the cordova configuration [here](https://www.dev2qa.com/how-to-set-android-sdk-path-in-windows-and-mac/).

## Setup

### Initialize the application

After you've made sure to have the correct things (and versions) installed, you
should be able to just run a few commands to get set up:

```
$ git clone https://github.com/wahid-racheh/cordova-react-firebase-app.git
$ cd cordova-react-firebase-app
$ npm run setup
```

This may take a few minutes.

If you get any errors, please read through
them and see if you can find out what the problem is. You may also want to look
at [Troubleshooting](#troubleshooting). If you can't work it out on your own
then please [file an issue][issue] and provide _all_ the output from the
commands you ran (even if it's a lot).

### Initialize firebase environment

- Login to your firebase console and create a new application

- Once the application created, setup firbase storage

  1. Go to firebase console
  2. Select your project
  3. Click on storage menu
  4. Initialize firebase storage
  5. Choose a cloud location (example : **europe-west2**)
  6. Then continue the firebase storage configuration and then click on rules tab
  7. Replace your current rules by the following one:

  ```ts
  service firebase.storage {
    match /b/{bucket}/o {
      match /{allPaths=**} {
        allow read;
        // allow read, write: if request.auth != null;
      }
    }
  }
  ```

- Setup firebase database

  1. Go to firebase console
  2. Select your project
  3. Click on database menu
  4. Initialize firebase database

- Setup firebase authentication method

  1. Go to firebase console
  2. Select your project
  3. Select Connection mode tab
  4. Enable e-mail address/password method

- Setup firebase cloud location:

  1. Go to firebase console
  2. Select your project
  3. Select general parameters tab
  4. Copy the cloud resource location value (example : **europe-west2**) and replace the **region** property value in your **server/functions/app-config.json**.

- Setup firebase config section:

  1. Go to firebase console
  2. Select project settings
  3. Select general parameters tab
  4. Add new web application
  5. Select your new web application in applications section
  6. Under Firebase SDK snippet, select Configuration radio button
  7. Then, replace your **firebaseConfig** section in **server/functions/app-config.json** file by your firebase configurations:

     ```json
     {
       "firebaseConfig": {
         "apiKey": "",
         "authDomain": "",
         "databaseURL": "",
         "projectId": "",
         "storageBucket": "",
         "messagingSenderId": "",
         "appId": ""
       }
     }
     ```

     **If you find that [storageBucket]() is empty, just wait a moment and refrech your firebase console untill the configuration get updated.**

- Setup firebase certificate :

  1. Go to firebase console
  1. Select project settings
  1. Select Service accounts tab
  1. Click on generate a new private key. This will let you download the project certificate json file
  1. Then, replace your **privateCertificate** section in **server/functions/app-config.json** file by the downloaded certificate content:
     ```json
     {
       "privateCertificate": {
         "type": "",
         "project_id": "",
         "private_key_id": "",
         "private_key": "",
         "client_email": "",
         "client_id": "",
         "auth_uri": "",
         "token_uri": "",
         "auth_provider_x509_cert_url": "",
         "client_x509_cert_url": ""
       }
     }
     ```

- Setup firebase default project id

  1. Copy **project_id** property value from your **server/functions/app-config.json**
  2. Then replace **default property value** in your **server/.firebaserc** file:

     ```json
     {
       "projects": {
         "default": ""
       }
     }
     ```

- Add database indexes:

  Replace [project_id]() in the following http requests by your firebase project id and request them in your browser :

  1. `https://console.firebase.google.com/project/`[project_id]()`/database/firestore/indexes?create_composite=Clxwcm9qZWN0cy9jb3Jkb3ZhLXJlYWN0LWZpcmViYXNlL2RhdGFiYXNlcy8oZGVmYXVsdCkvY29sbGVjdGlvbkdyb3Vwcy9ub3RpZmljYXRpb25zL2luZGV4ZXMvXxABGg0KCXJlY2lwaWVudBABGg0KCWNyZWF0ZWRBdBACGgwKCF9fbmFtZV9fEAI`

  2. `https://console.firebase.google.com/project/`[project_id]()`/database/firestore/indexes?create_composite=Cldwcm9qZWN0cy9jb3Jkb3ZhLXJlYWN0LWZpcmViYXNlL2RhdGFiYXNlcy8oZGVmYXVsdCkvY29sbGVjdGlvbkdyb3Vwcy9jb21tZW50cy9pbmRleGVzL18QARoOCgp1c2VySGFuZGxlEAEaDQoJY3JlYXRlZEF0EAIaDAoIX19uYW1lX18QAg`

  3. Now that you've made all the configurations, login to your firebase account using command line interface and deploy your firebase apis:

     ```
     $ firebase login
     $ npm run deploy
     ```

## Running and deploying the server

- To get the server up and running, run:

```shell
npm run server
```

This should start up your server.

You may have the following firebase issue :

```
TypeError: _onRequestWithOpts is not a function ...
```

You can follow [this link](https://stackoverflow.com/questions/56947574/cant-test-cloud-functions-locally-emulator-fails-to-start-with-typeerror-onr) to solve it.

```
// Fix
node_modules/firebase-tools/lib/emulator/functionsEmulatorRuntime.js

line 276:

const _onRequestWithOpts = httpsProvider._onRequestWithOpts;

should be:

const _onRequestWithOpts = httpsProvider._onRequestWithOptions;
```

- To deploy to firebase server, run:

```shell
npm run deploy
```

## Running, building and testing the react app

- To get the app up and running, run:

```shell
npm start
```

This should start up your browser.

You can also open [the deployment of the app on Netlify](https://advanced-react-patterns.netlify.com/).

- To build the app, run:

```shell
npm run build
```

This should build your app and copy the dist into cordova application.

- To test the app

```shell
npm run test
```

This will start [Jest](http://facebook.github.io/jest) in watch mode. Read the output and play around with it.

## Running the mobile application

**Be sure that you have the andorid sdk installed.**

To lunch the android app, run:

```shell
npm run device
```

This will prepare the android platform and run the app on your connected device
**(Only android supported)**

## Troubleshooting

<details>

<summary>"npm run setup" command not working</summary>

Here's what the setup script does. If it fails, try doing each of these things
individually yourself in every package:

```
# verify your environment will work with the project
node ./scripts/verify

# install dependencies
npm run init:deps

# verify the project is ready to run
npm run build
```

If any of those scripts fail, please try to work out what went wrong by the
error message you get. If you still can't work it out, feel free to
[open an issue][issue] with _all_ the output from that script. I will try to
help if I can.

</details>
