const http = require('http');
const {handleReqRes} = require('./helpers/handleReqRes')
const app = {};
app.config = {
  port: 5000,
};

app.createServer = () => {
  const server = http.createServer(app.handleReqRes);

  server.listen(app.config.port, () => {
    console.log(`App is running on port ${app.config.port}`);
  });
};
app.handleReqRes =  handleReqRes; 
app.createServer();
