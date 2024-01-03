module.exports = {
  apps : [{
    name: "upsapi",
    script: 'server.js',
    watch: '.',
    env_production: {
      NODE_ENV: "production",
      PORT: 8070
   },
   env_development: {
      NODE_ENV: "development",
      PORT: 8070
   }
  }],

  deploy : {
    production : {
      user : 'pi',
      host : '127.0.0.1',
      ref  : 'origin/main',
      repo : 'https://github.com/neerpatel/upsapi',
      path : '/var/node/upsapi',
      'pre-deploy-local': '',
      'post-deploy' : 'pm2 startOrRestart ecosystem.config.js --env production',
      'pre-setup': 'npm install'
    }
  }
};