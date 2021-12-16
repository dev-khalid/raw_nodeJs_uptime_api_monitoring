const handler = {}; 

handler.sampleHandler = (requestProperties,callback) => { 
  callback(200,{
    message: "Response from sample route"
  })
}

module.exports = handler; 