var Service = require('node-windows').Service;

// Create a new service object
var svc = new Service({
  name: 'Tdarr',
  description: 'Tdarr - Transcode automation',
  script: require('path').join(__dirname, 'main.js'),
  nodeOptions: [
    '--max_old_space_size=4096'
  ],
  env: [{
    name: 'MONGO_URL',
    value: 'mongodb://localhost:27017/Tdarr'
  },
  {
    name: 'PORT',
    value: '8265'
  },
  {
    name: 'ROOT_URL',
    value: 'http://localhost/'
  }
  ]
});

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install', function () {
  svc.start();
});

svc.install();
