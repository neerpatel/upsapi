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

function apcaccess() {
    var output = {};
    executeCmd('apcaccess', function (err, response) {
        if (err) {
            logger.error("apcaccess : " + err);
            throw err;
        }
        else {
            var lines = response.trim().split("\n");
            // loop over every line
            lines.forEach(function (line) {
                if (line.trim() != '' && line.includes(':')) {
                    var lineData = [];
                    try {
                        lineData = line.split(': ');
                        var label = lineData[0].toLowerCase().trim().replace(/[^a-zA-Z0-9 \.\-:]/g, "");
                        var value = lineData[1].trim().replace(/[^a-zA-Z0-9 \.\-:]/g, "");
                        output[label] = value;
                    } catch (error) {
                        logger.error("apcaccess : " + error);
                        logger.error("apcaccess : " + line);
                    }
                }
            });
        }
        return output;
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
                try {
                    var lineData = [];
                    // assign values
                    lineData = line.split(': ');

                    var label = lineData[0].toLowerCase().trim().replace(/[^a-zA-Z0-9 \.\-:]/g, "");
                    var value = lineData[1].trim().replace(/[^a-zA-Z0-9 \.\-:]/g, "");

                    response[label] = value;
                } catch (error) {
                    logger.error(error);
                    logger.error(line);
                }

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
    query(process.env.APCNIS_IP, process.env.APCNIS_PORT, function (err, response) {
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

    //var wanted = ['date', 'upsname', 'serialno', 'status', 'linev', 'linefreq', 'loadpct', 'battv', 'bcharge', 'model', 'timeleft'];
    try {
        res.header("Referer", "apcupsd");
        res.status(200).json(apcaccess());
    } catch (error) {
        logger.error(error);
        res.status(500).json(error);
    }

});

module.exports = { router, query, apcaccess};