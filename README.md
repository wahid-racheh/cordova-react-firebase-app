# Cordova react firebase app

This app is a sample omni-channel application developped using React, Cordova and Firebase. It aims to practice the base react features and the use of multiple platforms.

The app contains 3 main packages:

- Client: the react application
- Mobile: the cordova mobile application
- Server: the express firebase application

### Live demo

https://cordova-react-firebase.netlify.com/

username : test@test.com
password : testtest

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

### Initialize firebase console

- Login to your firebase console and create a new application

- Once the application created, add a new web application:

  1. Go to firebase console
  2. Select your project
  3. Go to project settings
  4. Select general parameters tab
  5. Scroll down to applications section
  6. Add a new web application to your project

- Setup authentication method

  1. Go to firebase console
  2. Select your project
  3. Click on authentication menu
  4. Select Connection mode tab
  5. Enable e-mail address/password method

- Setup database

  1. Go to firebase console
  2. Select your project
  3. Click on database menu
  4. Initialize the database
  5. Add database indexes:

     Copy your [project_id](#project_id) from your project general settings and replace it in the following http requests and then, request them in your browser :

     - `https://console.firebase.google.com/project/`[project_id](#project_id)`/database/firestore/indexes?create_composite=Clxwcm9qZWN0cy9jb3Jkb3ZhLXJlYWN0LWZpcmViYXNlL2RhdGFiYXNlcy8oZGVmYXVsdCkvY29sbGVjdGlvbkdyb3Vwcy9ub3RpZmljYXRpb25zL2luZGV4ZXMvXxABGg0KCXJlY2lwaWVudBABGg0KCWNyZWF0ZWRBdBACGgwKCF9fbmFtZV9fEAI`
     - `https://console.firebase.google.com/project/`[project_id](#project_id)`/database/firestore/indexes?create_composite=Cldwcm9qZWN0cy9jb3Jkb3ZhLXJlYWN0LWZpcmViYXNlL2RhdGFiYXNlcy8oZGVmYXVsdCkvY29sbGVjdGlvbkdyb3Vwcy9jb21tZW50cy9pbmRleGVzL18QARoOCgp1c2VySGFuZGxlEAEaDQoJY3JlYXRlZEF0EAIaDAoIX19uYW1lX18QAg`
     - `https://console.firebase.google.com/project/`[project_id](#project_id)`/database/firestore/indexes?create_composite=ClZwcm9qZWN0cy9jb3Jkb3ZhLXJlYWN0LWZpcmViYXNlL2RhdGFiYXNlcy8oZGVmYXVsdCkvY29sbGVjdGlvbkdyb3Vwcy9zY3JlYW1zL2luZGV4ZXMvXxABGg4KCnVzZXJIYW5kbGUQARoNCgljcmVhdGVkQXQQAhoMCghfX25hbWVfXxAC`
     - `https://console.firebase.google.com/project/`[project_id](#project_id)`/database/firestore/indexes?create_composite=Cldwcm9qZWN0cy9jb3Jkb3ZhLXJlYWN0LWZpcmViYXNlL2RhdGFiYXNlcy8oZGVmYXVsdCkvY29sbGVjdGlvbkdyb3Vwcy9jb21tZW50cy9pbmRleGVzL18QARoMCghzY3JlYW1JZBABGg0KCWNyZWF0ZWRBdBACGgwKCF9fbmFtZV9fEAI`
     - `https://console.firebase.google.com/project/`[project_id](#project_id)`/database/firestore/indexes?create_composite=ClBwcm9qZWN0cy9zb2NpYWxhcHAtZDJhOTYvZGF0YWJhc2VzLyhkZWZhdWx0KS9jb2xsZWN0aW9uR3JvdXBzL2NvbnRhY3RzL2luZGV4ZXMvXxABGg4KCnVzZXJIYW5kbGUQARoPCgtkaXNwbGF5TmFtZRABGgwKCF9fbmFtZV9fEAE`

- Setup storage

  1. Go to firebase console
  2. Select your project
  3. Click on storage menu
  4. Initialize the storage
  5. Choose a cloud location (example : **europe-west2**) and validate.
  6. Then click on rules tab
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

### Setup application config file

- Set firebase cloud location:

  1. Go to firebase console
  2. Select your project
  3. Go to project settings
  4. Select general parameters tab
  5. Copy the cloud resource location value (example : **europe-west2**) and replace the **region** property value in your **server/functions/app-config.json**.

- Set firebase config section:

  1. Go to firebase console
  2. Select your project
  3. Go to project settings
  4. Select general parameters tab
  5. Select your web application in applications section
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

  **If you find that [storageBucket](#storageBucket) is empty, just wait a moment and refrech your firebase console untill the configuration get updated.**

- Set firebase certificate :

  1. Go to firebase console
  2. Select your project
  3. Go to project settings
  4. Select Service accounts tab
  5. Click on generate a new private key. This will let you download the project certificate json file
  6. Then, replace your **privateCertificate** section in **server/functions/app-config.json** file by the downloaded certificate content:

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

- Set firebase default project id

  1. Copy [project_id](#project_id) property value from your **server/functions/app-config.json**
  2. Then replace **default property value** in your **server/.firebaserc** file:

  ```json
  {
    "projects": {
      "default": ""
    }
  }
  ```

- Now that you've made all the configurations, login to your firebase account using command line interface and deploy your firebase apis:

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
