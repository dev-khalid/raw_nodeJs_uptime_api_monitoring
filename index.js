const http = require('http');
const url = require('url');
const {StringDecoder} = require('string_decoder');

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
app.handleReqRes = (req, res) => {
  //request handling
  const parsedUrl = url.parse(req.url);  
  const path = parsedUrl.pathname; 
  const trimmedPath = path.replace(/^\/+|\/+$/g,'');  
  const method = req.method.toLowerCase(); 
  const queryStringObject = parsedUrl.query;  
  const headersObject = req.headers; 

  const decoder = new StringDecoder('utf-8'); 

  let realData = ''; 

  req.on('data',(buffer)=> { 
    realData += decoder.write(buffer); 
  })

  req.on('end',() => { 
    realData += decoder.end(); 
    console.log(realData); 
  })

  //response handling
  res.end('Server is running');
}; 
app.createServer();
