import axios from 'axios';
import { showAlert } from './alerts';

export const updateSettings = async (data, type) => {
  try {
    const url =
      type === 'password'
        ? 'http://127.0.0.1:1337/api/v1/users/update_password'
        : 'http://127.0.0.1:1337/api/v1/users/update_profile';

    const res = await axios({
      method: 'PATCH',
      url,
      data,
    });

    if (res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} updated successfully!`);
      window.setTimeout(() => {
        location.reload(true);
      }),
        1500;
    }
  } catch (err) {
    console.log(err);
    showAlert('error', err.response.data.message);
  }
};
