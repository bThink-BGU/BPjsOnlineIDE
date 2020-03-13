import axios from 'axios';

export const initCL = {
  func: init
};

function init(code) {
  return new Promise((resolve, reject) => {
    axios.post('http://localhost:8080/OnlineIDEServer/webapi/myresource/init', code, {
      withCredentials: true,
      headers: {'Content-Type': 'text/plain'}
    })
      .then(() => {
        resolve();
      }, (error) => {
        reject(error);
      });
  });
}
