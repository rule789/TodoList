let env = process.env.PORT || 'development';

if (env === 'development'){
  let config = require('./config.json');
  let configEnv = config[env];
  Object.keys(configEnv).forEach((key) => {
    process.env[key] = configEnv[key];
  })
}