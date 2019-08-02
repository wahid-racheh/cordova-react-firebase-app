/* eslint-disable */

var verifySystem = require("./setup").verifySystem;

var verifyPromise = verifySystem([
  verifySystem.validators.node(">=10.15.3"),
  verifySystem.validators.npm(">=6.9.0"),
  verifySystem.validators.firebase(">=7.0.2"),
  verifySystem.validators.cordova(">=9.0.0"),
  verifySystem.validators.git(">=2.22.0")
]);

verifyPromise.then(
  function() {
    // resolves if there are no errors
    console.log("🎉  Congrats! Your system is setup properly");
    console.log("You should be good to install and run things.");
  },
  function(error) {
    // rejects if there are errors
    console.error(error);
    console.info(
      "\nIf you don't care about these warnings, go " +
        "ahead and install dependencies with `node ./scripts/install`"
    );
    process.exitCode = 1;
  }
);
