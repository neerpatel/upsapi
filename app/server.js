'use strict';

const express = require('express');
const logger = require("./config/winston");
const { router: ups } = require("./api/ups");
const hubitat = require("./api/hubitat");
const bodyParser = require("body-parser");



// App
const app = express();

app.use(
    bodyParser.urlencoded({
        extended: false,
    })
);

app.use(bodyParser.json());

app.use((req, res, next) => {
    logger.info({
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      responseTime: Date.now() - req.startTime,
    });
    next();
  });

app.use("/ups", ups);
app.use("/hubitat", hubitat);
const port = process.env.PORT || 8070;
app.listen(port, () => logger.info(`Server running on port ${port}`));

process.on('SIGTERM', () => {
    logger.info('SIGTERM signal received.');
    logger.info('Closing http server.');
    server.close((err) => {
        logger.info('Http server closed.');
        process.exit(err ? 1 : 0);
    });
});