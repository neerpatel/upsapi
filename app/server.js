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
    logger.info(JSON.stringify({
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      //req: req,
      responseTime: Date.now() - req.startTime,
    }));
    next();
  });

app.use("/ups", ups);
app.use("/hubitat", hubitat);
const port = process.env.PORT || 8070;
app.listen(port, () => logger.info(`Server running on port ${port}`));

process.on('SIGINT', () => {  // was SIGTERM
    logger.info('SIGINT signal received.'); 
    logger.info('Closing http server.');
    server.close((err) => {
        logger.info('Http server closed.');
        process.exit(err ? 1 : 0);
    });
});