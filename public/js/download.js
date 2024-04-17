import axios from 'axios';
import { showAlert } from './alerts';

export const downloadPhotos = async (url, filename) => {
  try {
    const response = await axios({
      method: 'GET',
      url,
      responseType: 'blob',
    });
    const link = window.URL.createObjectURL(new Blob([response.data]));
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = link;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(link);
  } catch (error) {
    showAlert('error', 'Error downloading image');
  }
};
