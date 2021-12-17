const url = require('url');
const { StringDecoder } = require('string_decoder');
const routes = require('../routes');
const { notFoundHandler } = require('../handlers/routeHandlers/notFoundHandler');
const { parseJSON } = require('./utilities');



const handler = {};

handler.handleReqRes = (req, res) => {
  //request handling
  const parsedUrl = url.parse(req.url,true);
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, '');
  const method = req.method.toLowerCase();
  const queryStringObject = parsedUrl.query;
  const headersObject = req.headers;

  const requestProperties = {
    parsedUrl,
    path,
    trimmedPath,
    method,
    queryStringObject,
    headersObject,
  };
  const chosenHandler = routes[trimmedPath]
    ? routes[trimmedPath]
    : notFoundHandler;

  //request body parser
  const decoder = new StringDecoder('utf-8');

  let realData = '';

  req.on('data', (buffer) => {
    realData += decoder.write(buffer);
  });

  req.on('end', () => {
    realData += decoder.end();
    requestProperties.body = parseJSON(realData);
    chosenHandler(requestProperties, (statusCode, payload) => {
      statusCode = typeof statusCode === 'number' ? statusCode : 500;
      payload = typeof payload === 'object' ? payload : {};
      const payloadString = JSON.stringify(payload);

      res.setHeader('Content-type', 'application/json');
      res.writeHead(statusCode);
      res.end(payloadString); //the handler function will decide what to send
    });
  });
};

module.exports = handler;
