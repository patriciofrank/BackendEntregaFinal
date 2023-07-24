const loginForm = document.querySelector('#login-form');

if(loginForm){
  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
  
    const formData = new FormData(loginForm);
    const requestData = {};
    formData.forEach((value, key) => requestData[key] = value);

    try {
      const response = await fetch('http://localhost:3000/api/session/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });

      if (response.ok) {
        console.log('Login successful');
        loginForm.reset();
        const data = await response.json();
        const user = data.payload;
        // Guardar el usuario en sessionStorage
        sessionStorage.setItem('user', JSON.stringify(user));
        window.location.replace('/products');
      } else {
        console.error('Login failed');
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  });
}