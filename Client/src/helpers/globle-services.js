
import axios from "axios";

export function globalService(config) {
  return new Promise((resolve, reject) => {
    console.log(config);
    axios(config)
      .then((response) => {
        console.log(response);
        resolve(response.data);
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
}
