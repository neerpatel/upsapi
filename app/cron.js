const cron = require('node-cron');
const logger = require("./config/winston");
const axios = require('axios');

// pm2 instance name
const processName = process.env.name || 'cron';
logger.info('cron: Starting cron process.'); 
// Only schedule cron job if it´s the primary pm2 instance
if(processName === 'cron'){
    // schedule cron job
    cron.schedule('5 * * * *', async () => {
        logger.info('cron: Calling Hubitat'); 
        const response = await axios({
            method: 'get',
            url: `http://127.0.0.1:${process.env.PORT}/hubitat?event=cron`,
            headers: {
                'Content-Type': 'text/json',
            }
        });
        logger.info(`cron: ${response.status} - ${response.statusText}`);
    });
}

process.on('SIGINT', () => {  // was SIGTERM
    logger.info('cron: Closing cron process.');
});