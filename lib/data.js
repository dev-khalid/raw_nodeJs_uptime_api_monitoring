const fs = require('fs');
const path = require('path');

const lib = {};
lib.baseDir = path.join(__dirname, '/../data/');

lib.create = (dir, file, data, callback) => {
  //first of all amake ekta file open korte hobe write mode .. eitake fileFlags bole

  fs.open(`${lib.baseDir}${dir}/${file}.json`, 'wx', (err1, fileDescriptor) => {
    if (!err1 && fileDescriptor) {
      //convert data to string
      const stringData = JSON.stringify(data);

      //first write to file then close it
      fs.writeFile(fileDescriptor, stringData, (err2) => {
        if (!err2) {
          fs.close(fileDescriptor, (err3) => {
            if (!err3) {
              callback(false);
            } else {
              callback('Error closing the new file!');
            }
          });
        } else {
          callback('There was an error writing this file.');
        }
      });
    } else {
      callback('There was an error. File may already exist!');
    }
  });
};

lib.read = (dir, file, callback) => {
  fs.readFile(`${lib.baseDir}${dir}/${file}.json`, 'utf-8', (err, data) => {
    callback(err, data);
  });
};

lib.update = (dir, file, data, callback) => {
  //file open korte hobe
  fs.open(`${lib.baseDir + dir}/${file}.json`, 'r+', (err1, fileDescriptor) => {
    if (!err1 && fileDescriptor) {
      //file opended successfully
      const stringData = JSON.stringify(data);
      fs.ftruncate(fileDescriptor, (err2) => {
        if (!err2) {
          //successfully truncated
          fs.writeFile(fileDescriptor, stringData, (err3) => {
            if (!err3) {
              fs.close(fileDescriptor, (err4) => {
                if (!err4) {
                  callback(false);
                } else {
                  callback('There was an error closing file');
                }
              });
            } else {
              callback('Error writing file!');
            }
          });
        } else {
          callback('Error in truncating file.');
        }
      });
    } else {
      callback('Error opening file');
    }
  });
};

lib.delete = (dir, file, callback) => {
  fs.unlink(`${lib.baseDir + dir}/${file}.json`, (err) => {
    if (!err) {
      callback(false);
    } else {
      callback('Error deleting file!');
    }
  });
};

module.exports = lib;
