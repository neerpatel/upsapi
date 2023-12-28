'use strict';

const express = require('express');
function executeCmd(cmd,const logger = require("./config/winston"); callback) {

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
          callback(null,stdout);
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

  executeCmd('apcaccess', function(err, response) {
    if (err) {
      console.error(err);
    }
    else {
      logger.info(response);
      var lines = response.trim().split("\n");
      var output = {};
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
      res.send(JSON.stringify(output));
    }
  })
	
});

const port = process.env.PORT || PORT;
app.listen(port, () => logger.info(`Server running on port ${port}`));