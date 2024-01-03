const express = require("express");
const logger = require("../config/winston");
const router = express.Router();
const net = require('net');

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

function query(ip, port, callback) {
    const client = new net.Socket();
    let status = '';

    client.connect(port, ip, function () {
        client.write(Buffer.from([0, 6])); // htons(6)
        client.write('status');
    });

    client.on('data', function (data) {
        status += data.toString();
    });

    client.on('end', function () {
        const response = {};
        const lines = status.trim().split("\n");
        // loop over every line
        lines.forEach(function (line) {
            if (line.trim() != '' && line.includes(':')) {
            var lineData = [];
            // assign values
            var stats = line.split(': ');
            
            var label = stats[0].trim().replace(/[^a-zA-Z0-9 \.\-:]/g, "");
            var value = stats[1].trim().replace(/[^a-zA-Z0-9 \.\-:]/g, "");
            //label = label.replace(/(^\s+|\s+$)/g, '');
            //value = value.replace(/(^\s+|\s+$)/g, '');

            response[label] = value;
         
            /*for (let line of lines) {
                
                const rec = line.split(":");
                if (rec[0].trim() === '') break;
    
                //response[rec[0].trim().toLowerCase()] = rec[1].trim();
            }*/
            };
        });
        callback(null, response);
    });

    client.on('error', function (err) {
        callback(err);
    });

    client.setTimeout(5000, function () { // 5 seconds timeout
        client.end();
    });
}

const exec = require('child_process').exec;
router.get("/status", (req, res) => {
    query('192.168.0.101', 3551, function (err, response) {
        res.header("Referer", "apcupsd");
        if (err) {
            logger.error(err);
            res.status(500).json(err);
        }
        else {
            res.status(200).json(response);
        }
    });
});

router.get("/apcaccess", (req, res) => {

    var wanted = ['date', 'upsname', 'serialno', 'status', 'linev', 'linefreq', 'loadpct', 'battv', 'bcharge', 'model', 'timeleft'];
    try {
        executeCmd('apcaccess', function (err, response) {
            var output = {};
            if (err) {
                throw err;
            }
            else {
                var lines = response.trim().split("\n");
                // loop over every line
                lines.forEach(function (line) {
                    var lineData = [];
                    // assign values
                    var stats = line.split(' : ');
                    var label = stats[0].trim().replace(/[^a-zA-Z0-9 \.\-:]/g, "");
                    var value = stats[1].trim().replace(/[^a-zA-Z0-9 \.\-:]/g, "");
                    output[label] = value;
                    // remove surrounding spaces
                    //label = label.replace(/(^\s+|\s+$)/g, '');
                    // if found as wanted value, store it
                    /*if (wanted.indexOf(label) > -1) {
                        //value = value.replace(/(^\s+|\s+$)/g, '');

                        output[label] = value;
                        //output.push(lineData);
                        if (err) throw err;
                    }*/
                });
                res.status(200).json(output);
            }
        })
    } catch (error) {
        logger.error(error);
        res.status(500).json(error);
    }

});

module.exports = router;