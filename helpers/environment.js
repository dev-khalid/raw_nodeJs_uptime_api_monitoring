const environment = {}; 
environment.staging = {
  port : 3000, 
  envName: "staging"
}
environment.production = {
  port : 3000, 
  envName: "production"
}

//check which env variable was passed 
const currentEnvironment = typeof(process.env.NODE_ENV) === 'string' ? process.env.NODE_ENV : 'staging'; 


const environmentToExport = typeof(environment[currentEnvironment])==='object' ? environment[currentEnvironment] : environment.staging; 

module.exports = environmentToExport; 