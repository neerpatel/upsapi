module.exports = {
  apps : [{
    name: "upsapi",
    script: 'server.js',
    watch: '.',
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
  }],

  deploy : {
    production : {
      user : 'pi',
      host : '127.0.0.1',
      ref  : 'origin/main',
      repo : 'https://github.com/neerpatel/upsapi',
      path : '/opt/upsapi',
      'pre-deploy-local': '',
      'post-deploy': 'cd .\app\ && npm install'
    }
  }
};