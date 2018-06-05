const fetch = require('node-fetch');
const constants = require('./constants');

fetch(constants.audioData[0].feed).then(response => {
  console.log(response);
});
