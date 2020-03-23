const proxy = require('http-proxy-middleware');
const BACKEND_URL = 'http://localhost:5000';

module.exports = function(app) {
  app.use(proxy('/api', { target: BACKEND_URL, logLevel: 'debug' }));
  app.use(proxy('/auth/google', { target: BACKEND_URL }));
};
