const Cc = Components.classes;
const Ci = Components.interfaces;
const Cu = Components.utils;

function quit() {
  var appStartup = Cc['@mozilla.org/toolkit/app-startup;1'].
                   getService(Ci.nsIAppStartup);

  appStartup.quit(Ci.nsIAppStartup.eAttemptQuit);
}

window.addEventListener(
  "load",
  function() {
    var SecurableModule = {};
    var Tests = {};

    var passed = 0;
    var failed = 0;
    function log(message, label) {
      dump(label + ": " + message + "\n");
      switch (label) {
      case "pass":
        passed++;
        break;
      case "fail":
        failed++;
        break;
      case "info":
        break;
      default:
        throw new Exception("Unexpected label: " + label);
      }
    }

    try {
      var dirSvc = Cc["@mozilla.org/file/directory_service;1"]
                   .getService(Ci.nsIDirectoryServiceProvider);
      var rootDir = dirSvc.getFile("CurWorkD", {});
      rootDir.append("interoperablejs-read-only");
      rootDir.append("compliance");
      if (!rootDir.exists()) {
        throw new Error(
          ("Compliance test directory doesn't exist at " +
           rootDir.path + ". Please obtain it by running " +
           "'svn checkout " +
           "http://interoperablejs.googlecode.com/svn/trunk/ " +
           "interoperablejs-read-only'.")
        );
      }

      Cu.import("resource://jetpack/modules/booster.js", SecurableModule);
      Cu.import("resource://jetpack/modules/booster-tests.js", Tests);
      Tests.run(SecurableModule, log, rootDir);
      dump("tests passed: " + passed + "\n");
      dump("tests failed: " + failed + "\n");
      if (passed >= 0 && failed == 0)
        dump("OK\n");
      else
        dump("FAIL\n");
    } catch (e) {
      dump("Exception: " + e + " (" + e.fileName +
           ":" + e.lineNumber + ")\n");
      if (e.stack)
        dump("Stack:\n" + e.stack);
      dump("FAIL\n");
    }
    quit();
  },
  false
);