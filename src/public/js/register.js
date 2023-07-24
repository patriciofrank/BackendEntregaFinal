const registerForm = document.querySelector('#register-form');
registerForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  
  const formData = new FormData(registerForm);
  const requestData = {};
  formData.forEach((value, key) => requestData[key] = value);

  try {
    const response = await fetch('http://localhost:3000/api/session/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    });

    if (response.ok) {
      console.log('Registration successful');
      registerForm.reset();
      window.location.replace('/login');
    } else {
      console.error('Registration failed');
    }
  } catch (error) {
    console.error('An error occurred:', error);
  }
});