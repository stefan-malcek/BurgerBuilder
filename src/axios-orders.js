import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://burgerbuilder-6485d.firebaseio.com/'
});

instance.interceptors.request.use(
  request => {
    return request;
  },
  error => {
    return Promise.reject(error);
  }
);

export default instance;
