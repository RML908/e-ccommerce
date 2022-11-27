const testJson = require('../db.json')

exports.handler = async (event) =>{
  return{
    statusCode:200,
    body: JSON.stringify(testJson),
    headers:{
      'content-type': 'application/json'
    }
  };
};
