function submitForm(event) {
  event.preventDefault(); // Ngăn chặn việc gửi biểu mẫu mặc định

  let searchInput = document.getElementById('searchInput').value;

  if (searchInput.startsWith('#')) {
    searchInput = 'all' + searchInput;
  }
  // const encodedSearchInput = encodeURIComponent(searchInput.replace('#', '?hashtags=').replaceAll('#', ',')); // Encode input thành URL

  // Chuyển hướng đến URL mong muốn
  window.location.href = `http://127.0.0.1:1337/search/${searchInput.replace('#', '?hashtags=').replaceAll('#', ',')}`;
}

export const search = () => {
  let searchInput = document.getElementById('searchInput').value;

  if (searchInput.startsWith('#')) {
    searchInput = 'all' + searchInput;
  }

  // Chuyển hướng đến URL mong muốn
  window.location.href = `http://127.0.0.1:1337/search/${searchInput.replace('#', '?hashtags=').replaceAll('#', ',')}`;
};
