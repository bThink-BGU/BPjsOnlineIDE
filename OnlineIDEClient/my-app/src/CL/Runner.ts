import axios from 'axios';

export const runCL = {
  func: run
};

function run() {
  return new Promise((resolve, reject) => {
    axios.get('http://localhost:8080/OnlineIDEServer/webapi/myresource/run', {
      withCredentials: true,
      headers: {'Content-Type': 'text/plain'}
    })
      .then((response) => {
        resolve(response.data);
      }, (error) => {
        reject(error.toString());
      });
  });
}


