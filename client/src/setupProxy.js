const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = app => {
  // Send api calls to the api server
  app.use(
    '/api/*',
    createProxyMiddleware({
      target: 'http://localhost:5050',
    })
  );
};
