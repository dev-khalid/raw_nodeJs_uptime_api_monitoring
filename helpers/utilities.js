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
module.exports = utilities;
