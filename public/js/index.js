import { login, logout } from './login';
import { signUp } from './register';
import { updateSettings } from './updateSettings';
import { deletePhoto } from './delete';
import { downloadPhotos } from './download';
import { like } from './likes';

const loginForm = document.querySelector('.form--login');
const signUpForm = document.querySelector('.form--register');
const logOutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const deleteBtn = document.getElementById('delete-photo');
const downloadBtn = document.getElementById('download-all');
const likeIcon = document.getElementById('heart');

if (loginForm)
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });

if (logOutBtn) logOutBtn.addEventListener('click', logout);

if (signUpForm)
  signUpForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;
    signUp({ name, email, password, passwordConfirm });
  });

if (userDataForm)
  userDataForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);

    updateSettings(form, 'data');
  });

if (userPasswordForm)
  userPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.btn--save-password').textContent = 'Updating...';

    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password'
    );

    document.querySelector('.btn--save-password').textContent = 'Save password';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });

if (deleteBtn)
  deleteBtn.addEventListener('click', (e) => {
    e.target.textContent = 'Deleting...';
    const { photoId } = e.target.dataset;
    deletePhoto(photoId);
  });

if (downloadBtn)
  downloadBtn.addEventListener('click', (e) => {
    e.target.textContent = 'Downloading...';

    const { images } = e.target.dataset;
    const arr = images.split(',');
    console.log(arr);
    arr.forEach((img) => {
      downloadPhotos(`/img/photos/${img}`, img);
    });

    setTimeout(() => {
      e.target.textContent = 'Download';
    }, 1500);
  });

if (likeIcon)
  likeIcon.addEventListener('click', (e) => {
    const photo = e.target.dataset.photoId;
    const user = e.target.dataset.userId;
    like({ photo, user });
  });
