import axios from 'axios';
import { showAlert } from './alerts';

export const signUp = async (data) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:1337/api/v1/users/signup',
      data,
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Signed up successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }),
        1500;
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
