'use strict';

const express = require('express');
const logger = require("./config/winston");
const {router: ups} = require("./api/ups");
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

app.use("/ups", ups);
app.use("/hubitat", ups);
const port = process.env.PORT || 8070;
app.listen(port, () => logger.info(`Server running on port ${port}`));