const axios = require('axios');
const message = 'Hello World';

const url = 'https://profoundproject.com/tele/';

axios.get(url, {
  params: {
    message: message
  }
})
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.error(error);
  });