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
      host: ['127.0.0.1'],
      ref: 'origin/main',
      repo: 'git@github.com:neerpatel/upsapi.git',
      path: '/opt/upsapi',
      'pre-deploy-local': '',
      'pre-setup' : 'curl -sL https://raw.githubusercontent.com/neerpatel/upsapi/main/setup.sh | sudo -E bash -',
      'post-setup': "ls -la",
      'post-deploy': 'pwd && sh ./post-deploy.sh',
    }
  }
};