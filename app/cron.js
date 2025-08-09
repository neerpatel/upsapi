const cron = require("node-cron");
const logger = require("./config/winston");
const axios = require("axios");

// pm2 instance name
const processName = process.env.name || "cron";
// ensure we always have a string cron expression
const cronExpr = process.env.CRON ? String(process.env.CRON) : "*/5 * * * *";

// Only schedule cron job if it´s the primary pm2 instance
if (processName === "cron") {
  // schedule cron job
  let valid = false;
  try {
    valid = cron.validate(cronExpr);
  } catch (error) {
    logger.error(`cron: validate error: ${error}`);
  }

  if (!valid) {
    logger.error(
      `cron: Invalid CRON expression '${cronExpr}'. Skipping scheduler start.`
    );
    return;
  }

  logger.info(`cron: Starting cron process with expression '${cronExpr}'.`);
  try {
    cron.schedule(cronExpr, async () => {
      logger.info("cron: Calling Hubitat");
      const response = await axios({
        method: "get",
        url: `http://127.0.0.1:${process.env.PORT}/hubitat?event=cron`,
        headers: {
          "Content-Type": "text/json",
        },
      });
      logger.info(`cron: ${response.status} - ${response.statusText}`);
    });
  } catch (error) {
    logger.error(`cron: schedule error: ${error}`);
  }
}

process.on("SIGINT", () => {
  // was SIGTERM
  logger.info("cron: Closing cron process.");
});
