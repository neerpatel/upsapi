const express = require("express");
const logger = require("../config/winston");
const { query } = require("./ups");
const router = express.Router();
const axios = require('axios');

async function callHubitat(data) {
    const HUB_IP = process.env.HUB_IP; // assuming HUB_IP is an environment variable

    const url = `http://${HUB_IP}/notify`;

    const postData = {
        data: data
    };

    const response = await axios({
        method: 'post',
        url: url,
        data: postData,
        headers: {
            'Content-Type': 'text/html',
            'Content-Length': JSON.stringify(postData).length,
            'Referer': 'apcupsd'
        },
        port: process.env.HUB_PORT
    });

    return response.data;
}

router.post("/", async (req, res) => {
    var data;
    try {
        query(process.env.APCNIS_IP, process.env.APCNIS_PORT, function (err, response) {
            if (err) {
                throw err;
            }
            else {
                data = response;
            }
        });
        const postresponse = await callHubitat(data);
        res.status(200).json(postresponse);
    } catch (error) {
        logger.error(error);
        res.status(500).send("Error calling Hubitat");
    }
});

module.exports = router;