'use strict';

const express = require('express');
const logger = require("./config/winston");

function executeCmd(cmd, callback) {

  exec(cmd, function (err, stdout, stderror) {
    // console.log('stdout: %s', output);
    if (err) {
      callback(err);
    }
    else if (stderror) {
      callback(stderror);
    }
    else {
      if (stdout) {
        callback(null, stdout);
      }
      else {
        callback(null, null);
      }
    }
  });
}


const exec = require('child_process').exec;
// App
const app = express();
app.get('/', (req, res) => {

  var wanted = ['upsname', 'serialno', 'status', 'linev', 'linefreq', 'loadpct', 'battv', 'bcharge'];
  try {
    executeCmd('apcaccess', function (err, response) {
      var output = {};
      if (err) {
        throw err;
      }
      else {
        logger.info(response);
        var lines = response.trim().split("\n");
        // loop over every line
        lines.forEach(function (line) {
          var lineData = [];
          // assign values
          var stats = line.split(' : ');
          var label = stats[0].toLowerCase();
          var value = stats[1];

          // remove surrounding spaces
          label = label.replace(/(^\s+|\s+$)/g, '');
          // if found as wanted value, store it
          if (wanted.indexOf(label) > -1) {
            value = value.replace(/(^\s+|\s+$)/g, '');

            output[label] = value;
            //output.push(lineData);
            if (err) throw err;
          }
        });
        res.status(200).json(JSON.stringify(output));
      }
    })
  } catch (error) {
    logger.error(error);
    res.status(500).json(JSON.stringify(error));
  }

});

const port = process.env.PORT || PORT;
app.listen(port, () => logger.info(`Server running on port ${port}`));