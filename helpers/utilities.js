const crypto = require('crypto');

const utilities = {};
utilities.parseJSON = (jsonString) => {
  let output;
  try {
    output = JSON.parse(jsonString);
  } catch (error) {
    output = {};
  }
  return output;
};
utilities.hash = (stringData) => {
  if (typeof stringData === 'string' && stringData.length > 0) {
    return crypto
      .createHmac('sha256', 'this is the secret of the password ')
      .update(stringData)
      .digest('hex');
  }
  return false;
};
utilities.createRandomString = (strlength) => {
  let length = strlength;
  length = typeof strlength === 'number' && strlength > 0 ? strlength : false;

  if (length) {
    const possiblecharacters = 'abcdefghijklmnopqrstuvwxyz1234567890';
    let output = '';
    for (let i = 1; i <= length; i += 1) {
      const randomCharacter = possiblecharacters.charAt(
        Math.floor(Math.random() * possiblecharacters.length)
      );
      output += randomCharacter;
    }
    return output;
  }
  return false;
};
module.exports = utilities;
