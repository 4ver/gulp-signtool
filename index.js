'use strict';

var Stream = require('stream');
var Path = require('path');
var exec = require('child_process').exec;

function signTool() {

  var stream = new Stream.Transform({objectMode: true});

  var signWindowsExecutable = function (filePath, cb) {

    exec('signtool sign /a "' + filePath + '"', function (error, stdout, stderr) {
      if(error != null) return cb(error);
      if(stderr !== '') return cb(stderr);

      exec('signtool verify /pa "' + filePath + '"', function (error, stdout, stderr) {
        if(error != null) return cb(error);
        if(stderr !== '') return cb(stderr);

        if( stdout.indexOf('Successfully verified') != -1) {
          cb();
        }
        else {
          cb(stdout);
        }
      });
    });
  }



  stream._transform = function(file, unused, callback) {
    signWindowsExecutable(file.path, function (error) {
      callback(error, file);
    });
  };

  return stream;
}

module.exports = signTool;
