const { hash, parseJSON } = require('../../helpers/utilities');
const data = require('../../lib/data');

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
    //user er data phone number er basis a read korar try korbo .
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
      //ebar age phone number ta check dite hobe .
      data.read('user', phone, (err1, uData) => {
        if (!err1 && uData) {
          //ebar ei udata jehetu file system theke asche so eitake json.parse kore nite hobe .
          const userData = { ...parseJSON(uData) };
          //ebar amake update kore dite hobe .
          if (firstName) {
            userData.firstName = firstName;
          }
          if (lastName) {
            userData.lastName = lastName;
          }
          if (password) {
            userData.password = hash(password);
          }

          data.update('user', phone, userData, (err2) => {
            if (!err2) {
              callback(200, {
                message: 'user updated Successfully!',
              });
            } else {
              callback(500, {
                error: 'there was an error in server side!',
              });
            }
          });
        } else {
          callback(400, {
            error: 'Phone number does not match!',
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
handler._user.delete = (requestProperties, callback) => {
  const phone =
    typeof requestProperties.queryStringObject.phone === 'string' &&
    requestProperties.queryStringObject.phone.trim().length === 11
      ? requestProperties.queryStringObject.phone
      : false;
  if (phone) {
    data.read('user', phone, (err, userData) => {
      if (!err && userData) {
        data.delete('user', phone, (err2) => {
          if (!err2) {
            callback(204, {
              message: 'User Deleted Successfully!',
            });
          } else {
            callback(500, {
              error: 'Server side Error',
            });
          }
        });
      } else {
        callback(404, {
          error: 'Phone number does not exist!',
        });
      }
    });
  } else {
    callback(400, {
      error: 'Invalid Phone Number!',
    });
  }
};
module.exports = handler;
