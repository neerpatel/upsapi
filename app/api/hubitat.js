const express = require("express");
const logger = require("../config/winston");
const { apcaccess } = require("./ups");
const router = express.Router();
const axios = require('axios');
const { log } = require("winston");

function callHubitat(data, callback) {
    var response = {};
    const HUB_IP = process.env.HUB_IP; // assuming HUB_IP is an environment variable

    const url = `http://${HUB_IP}:${process.env.HUB_PORT}/notify`;
    try {
        response = axios({
            method: 'post',
            url: url,
            data: data,
            headers: {
                'Content-Type': 'text/json',
                'Content-Length': JSON.stringify(data).length,
                'Referer': 'apcupsd'
            },
            //port: process.env.HUB_PORT
        });
        callback(null, response);
    } catch (error) {
        logger.error(`callHubitat - ${error}`);
        callback(error);
    }
    //return response.data;
}

router.get("/", (req, res) => {
    var data;
    var event = {};
    try {
        if ('event' in req.query) {
            event['event'] = req.query['event'];
            
            
            if (event['msg'] in req.query) {
                event['msg'] = req.query['msg'];
                logger.info(`/hubitat: message ${req.ip} event = ${event['event']} - msg = ${event['msg']}`);
            } else {
                logger.info(`/hubitat: was called by ${req.ip} event = ${event['event']}`);
            }
            
        } else { 
            logger.info(`/hubitat: was called by ${req.ip}`);
        }
        apcaccess((err, response) => {
            if (err) {
                logger.error(err);
                res.status(500).json(err);
            }
            else {
                callHubitat({ ...event, ...response }, (err, response) => {
                    if (err) {
                        logger.error(err);
                        res.status(500).json(err);
                    }
                    else {
                        res.status(200).json(response);
                    }
                });
            }
        });
    } catch (error) {
        logger.error(error);
        res.status(500).send("Error calling Hubitat");
    }
});

module.exports = router;