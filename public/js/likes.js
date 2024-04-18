import axios from 'axios';
import { showAlert } from './alerts';

export const like = async (data) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `http://127.0.0.1:1337/api/v1/likes`,
      data,
    });

    if (res.status === 201) {
      showAlert('success', 'You liked this photo');
      location.reload(true);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const unlike = async (id) => {
  try {
    const res = await axios({
      method: 'DELETE',
      url: `http://127.0.0.1:1337/api/v1/likes/${id}`,
    });

    if (res.status === 204) {
      location.reload(true);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
