const handler = {};

handler.notFoundHandler = (requestProperties,callback) => {
  callback(404,{
    message : `${requestProperties.path} was not found`
  })
};

module.exports = handler;
