export const generateResetToken = (email) => {
    const timestamp = Date.now();
    const token = Math.random().toString(36) + timestamp;
    return { token, email, timestamp };
  };
  
  
  export const isTokenExpired = (passwordData, email) => {
    if (passwordData.email !== email) {
      return true; // El token no pertenece al correo electrónico proporcionado
    }
    
    const elapsedTime = Date.now() - passwordData.timestamp;
    const expirationTime = 60 * 60 * 1000; // 1 hora
  
    return elapsedTime > expirationTime;
  };