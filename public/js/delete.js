import axios from 'axios';
import { showAlert } from './alerts';

export const deletePhoto = async (id) => {
  try {
    const res = await axios({
      method: 'DELETE',
      url: `http://127.0.0.1:1337/api/v1/photos/${id}`,
    });

    if (res.status === 204) {
      showAlert('success', 'Delete successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }),
        1500;
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
