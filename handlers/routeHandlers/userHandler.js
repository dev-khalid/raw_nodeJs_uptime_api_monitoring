const { hash, parseJSON } = require('../../helpers/utilities');
const data = require('../../lib/data');
const tokenHandler = require('./tokenHandler');

const handler = {};

handler.userHandler = (requestProperties, callback) => {
  const acceptedMethods = ['get', 'post', 'put', 'delete'];
  if (acceptedMethods.indexOf(requestProperties.method) > -1) {
    handler._user[requestProperties.method](requestProperties, callback);
  } else {
    callback(405);
  }
};
handler._user = {};
handler._user.get = (requestProperties, callback) => {
  //first a queryStringObject take sanitize kore nite hobe .
  const phone =
    typeof requestProperties.queryStringObject.phone === 'string' &&
    requestProperties.queryStringObject.phone.trim().length === 11
      ? requestProperties.queryStringObject.phone
      : false;
  if (phone) {
    // verify token
    const token =
      typeof requestProperties.headersObject.token === 'string'
        ? requestProperties.headersObject.token
        : false;

    tokenHandler._token.verify(token, phone, (tokenId) => {
      if (tokenId) {
        // lookup the user
        data.read('user', phone, (err, u) => {
          if (!err) {
            const user = { ...parseJSON(u) };
            delete user.password;
            callback(200, user);
          } else {
            callback(404, {
              error: 'User Not Found!',
            });
          }
        });
      } else {
        callback(403, {
          error: 'Authentication failure!',
        });
      }
    });
    //user er data phone number er basis a read korar try korbo .
  } else {
    callback(400, {
      error: 'There is a problem in your request!',
    });
  }
};
handler._user.post = (requestProperties, callback) => {
  const firstName =
    typeof requestProperties.body.firstName === 'string' &&
    requestProperties.body.firstName.trim().length > 0
      ? requestProperties.body.firstName
      : false;
  const lastName =
    typeof requestProperties.body.lastName === 'string' &&
    requestProperties.body.lastName.trim().length > 0
      ? requestProperties.body.lastName
      : false;
  const phone =
    typeof requestProperties.body.phone === 'string' &&
    requestProperties.body.phone.trim().length === 11
      ? requestProperties.body.phone
      : false;
  const tosAgreement =
    typeof requestProperties.body.tosAgreement === 'boolean' &&
    requestProperties.body.tosAgreement
      ? requestProperties.body.tosAgreement
      : false;
  const password =
    typeof requestProperties.body.password === 'string' &&
    requestProperties.body.password.trim().length > 0
      ? requestProperties.body.password
      : false;

  if (firstName && lastName && phone && tosAgreement && password) {
    //userObject ta create kore nite hobe
    const userObject = {
      firstName,
      lastName,
      phone,
      tosAgreement,
      password: hash(password),
    };
    //check korte hobe je ei phone.json name already existing file ache kina
    data.read('user', phone, (err) => {
      if (err) {
        //there is no such file found safely now create new file with given data
        data.create('user', phone, userObject, (err2) => {
          if (!err2) {
            callback(201, {
              message: 'User created successfully!',
            });
          } else {
            callback(500, { error: err2 });
          }
        });
      } else {
        //callback is used to give feedback to the calling function .
        callback(400, {
          error: 'Problem in your request!',
        });
      }
    });
    //jodi thake tahole error

    //jodi na thake tahole data.create call kore create kore dite hobe
  } else {
    callback(400, {
      error: 'There was a problem in your request!',
    });
  }
};

handler._user.put = (requestProperties, callback) => {
  //first a phone number dekhe dekhe melabo
  const firstName =
    typeof requestProperties.body.firstName === 'string' &&
    requestProperties.body.firstName.trim().length > 0
      ? requestProperties.body.firstName
      : false;
  const lastName =
    typeof requestProperties.body.lastName === 'string' &&
    requestProperties.body.lastName.trim().length > 0
      ? requestProperties.body.lastName
      : false;
  const phone =
    typeof requestProperties.body.phone === 'string' &&
    requestProperties.body.phone.trim().length === 11
      ? requestProperties.body.phone
      : false;
  const password =
    typeof requestProperties.body.password === 'string' &&
    requestProperties.body.password.trim().length > 0
      ? requestProperties.body.password
      : false;

  if (phone) {
    if (firstName || lastName || password) {
      const token =
        typeof requestProperties.headersObject.token === 'string'
          ? requestProperties.headersObject.token
          : false;

      tokenHandler._token.verify(token, phone, (tokenId) => {
        if (tokenId) {
          // loopkup the user
          data.read('users', phone, (err1, uData) => {
            const userData = { ...parseJSON(uData) };

            if (!err1 && userData) {
              if (firstName) {
                userData.firstName = firstName;
              }
              if (lastName) {
                userData.firstName = firstName;
              }
              if (password) {
                userData.password = hash(password);
              }

              // store to database
              data.update('users', phone, userData, (err2) => {
                if (!err2) {
                  callback(200, {
                    message: 'User was updated successfully!',
                  });
                } else {
                  callback(500, {
                    error: 'There was a problem in the server side!',
                  });
                }
              });
            } else {
              callback(400, {
                error: 'You have a problem in your request!',
              });
            }
          });
        } else {
          callback(403, {
            error: 'Authentication failure!',
          });
        }
      });
    } else {
      callback(400, {
        error: 'There should be at least one field to update!',
      });
    }
  } else {
    callback(400, {
      error: 'Invalid Phone number!',
    });
  }
  //jodi file ta read kora jay tahole amra update korar jonne data.update method ke call kore update kore dibo . and amar mote ami ekhane kono prokare kono pure update korbo na ekdom full replace kore dibo .
};
handler._users.delete = (requestProperties, callback) => {
  // check the phone number if valid
  const phone =
    typeof requestProperties.queryStringObject.phone === 'string' &&
    requestProperties.queryStringObject.phone.trim().length === 11
      ? requestProperties.queryStringObject.phone
      : false;

  if (phone) {
    // verify token
    const token =
      typeof requestProperties.headersObject.token === 'string'
        ? requestProperties.headersObject.token
        : false;

    tokenHandler._token.verify(token, phone, (tokenId) => {
      if (tokenId) {
        // lookup the user
        data.read('users', phone, (err1, userData) => {
          if (!err1 && userData) {
            data.delete('users', phone, (err2) => {
              if (!err2) {
                callback(200, {
                  message: 'User was successfully deleted!',
                });
              } else {
                callback(500, {
                  error: 'There was a server side error!',
                });
              }
            });
          } else {
            callback(500, {
              error: 'There was a server side error!',
            });
          }
        });
      } else {
        callback(403, {
          error: 'Authentication failure!',
        });
      }
    });
  } else {
    callback(400, {
      error: 'There was a problem in your request!',
    });
  }
};

module.exports = handler;
