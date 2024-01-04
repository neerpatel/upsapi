const express = require("express");
const logger = require("../config/winston");
const { apcaccess } = require("./ups");
const router = express.Router();
const axios = require('axios');

function callHubitat(data, callback) {
    const response = {};
    const HUB_IP = process.env.HUB_IP; // assuming HUB_IP is an environment variable

    const url = `http://${HUB_IP}:${process.env.HUB_PORT}/notify`;
    logger.info(`callHubitat url - ${url}`);
    logger.info(`callHubitat data - ${JSON.stringify(data)}`);
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
    var event;
    try {
        if (req.params.event === '') {
            event = { event: req.params.event };
        }
        logger.info(`hubitat get event- ${JSON.stringify(event)}`);
        apcaccess(function (err, response) {
            if (err) {
                logger.error(err);
                res.status(500).json(err);
            }
            else {
                logger.info(`hubitat get data- ${JSON.stringify(response)}`);
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