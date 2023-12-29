module.exports = {
  apps : [{
    name: "upsapi",
    script: 'server.js',
    watch: '.',
    env_production: {
      NODE_ENV: "production",
      PORT: 8080
   },
   env_development: {
      NODE_ENV: "development",
      PORT: 8070
   }
  }],

  deploy : {
    production : {
      user : 'SSH_USERNAME',
      host : 'SSH_HOSTMACHINE',
      ref  : 'origin/main',
      repo : 'https://github.com/neerpatel/upsapi',
      path : '/var/node/upsapi',
      'pre-deploy-local': '',
      'post-deploy' : 'pm2 reload ecosystem.config.js --env production',
      'pre-setup': 'npm install'
    }
  }
};