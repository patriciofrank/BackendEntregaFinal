function validatePasswords() {
    let password = document.getElementById('password').value;
    let confirmPassword = document.getElementById('confirmPassword').value;
    let passwordMismatch = document.getElementById('passwordMismatch');
  
    if (password !== confirmPassword) {
      passwordMismatch.classList.remove('d-none');
      return false; // Impide que el formulario se envíe si las contraseñas no coinciden
    } else {
      passwordMismatch.classList.add('d-none');
      return true; // Permite que el formulario se envíe si las contraseñas coinciden
    }
  }