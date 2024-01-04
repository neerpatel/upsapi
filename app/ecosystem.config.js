module.exports = {
  apps: [{
    name: "upsapi",
    script: 'server.js',
    watch: true,
    ignore_watch: ["node_modules", "logs"],
    env_production: {
      NODE_ENV: "production",
      PORT: 8070,
      HUB_IP: "192.168.107.116",
      HUB_PORT: 39501,
      APCNIS_IP: "127.0.0.1",
      APCNIS_PORT: 3551

    },
    env_development: {
      NODE_ENV: "development",
      PORT: 8070,
      HUB_IP: "192.168.107.116",
      HUB_PORT: 39501,
      APCNIS_IP: "127.0.0.1",
      APCNIS_PORT: 3551
    }
  },
  {
    name: "cron",
    script: 'cron.js',
    watch: 'cron.js',
    ignore_watch: ["node_modules", "logs"],
    env_production: {
      NODE_ENV: "production",
      CRON: "*/5 * * * *",
      PORT: 8070,
    },
    env_development: {
      NODE_ENV: "development",
      CRON: "*/5 * * * *",
      PORT: 8070
    }
  }],

  deploy: {
    production: {
      user: 'pi',
      host: '127.0.0.1',
      ref: 'origin/main',
      repo: 'https://github.com/neerpatel/upsapi',
      path: '/opt/upsapi',
      'pre-deploy-local': '',
      'post-deploy': 'cd ./app && npm install && pm2 reload ecosystem.config.js --env production',
    }
  }
};