'use strict';

const express = require('express');
const logger = require("./config/winston");
const ups = require("./api/ups");
const bodyParser = require("body-parser");



// App
const app = express();

app.use("/ups", ups);

const port = process.env.PORT || 8070;
app.listen(port, () => logger.info(`Server running on port ${port}`));