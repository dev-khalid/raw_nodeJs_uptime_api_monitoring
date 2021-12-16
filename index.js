const http = require('http');
const environment = require('./helpers/environment');
const { handleReqRes } = require('./helpers/handleReqRes');
const data = require('./lib/data');

data.delete(
  'test',
  'newFile',

  (err) => {
    console.log(err);
  }
);
const app = {};

app.createServer = () => {
  const server = http.createServer(app.handleReqRes);
  server.listen(environment.port, () => {
    console.log(`App is running on port ${environment.port}`);
  });
};
app.handleReqRes = handleReqRes;
app.createServer();
