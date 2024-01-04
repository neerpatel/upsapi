const express = require("express");
const logger = require("../config/winston");
const { query } = require("./ups");
const router = express.Router();
const axios = require('axios');

async function callHubitat(data) {
    const HUB_IP = process.env.HUB_IP; // assuming HUB_IP is an environment variable

    const url = `http://${HUB_IP}:${process.env.HUB_PORT}/notify`;
    logger.info(`callHubitat url - ${url}`);
    logger.info(`callHubitat data - ${JSON.stringify(data)}`);
    try {
        const response = await axios({
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
    } catch (error) {
        logger.error(`callHubitat - ${error}`);
        throw error;
    }
    return response.data;
}

router.get("/", async (req, res) => {
    var data;
    var event;
    try {
        if (req.params.event === '') {
            event = { event: req.params.event };
        }
        logger.info(`hubitat get event- ${JSON.stringify(event)}`);
        query(process.env.APCNIS_IP, process.env.APCNIS_PORT, function (err, response) {
            if (err) {
                throw err;
            }
            else {
                data = response;
            }
        });
        logger.info(`hubitat get data- ${JSON.stringify(data)}`);
        const postresponse = await callHubitat({ ...event, ...data });
        res.status(200).json(postresponse);
    } catch (error) {
        logger.error(error);
        res.status(500).send("Error calling Hubitat");
    }
});

module.exports = router;