const uplaodFunction = event => {
    const files = event.target.files;
    const data = new FormData();
    data.append('file', files[0]);
  
    fetch('/pictures', {
      method: 'POST',
      body: data
    });
  }
  
  document.getElementById('formFile').addEventListener('change', event => {
    uplaodFunction(event);
  });