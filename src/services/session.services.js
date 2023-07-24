export const getSessionService = async (loginStatus) => {
    if (loginStatus) {
      return "Bienvenido/a a mi tienda";
    }
    return "Por favor inicie sesión";
  };
  
  export const testLoginService = async (user) => {
    if (!user) {
      throw new Error("Usuario no válido");
    }
    const sessionData = {
      first_name: user.first_name,
      last_name: user.last_name,
      age: user.age,
      email: user.email,
    };
    return sessionData;
  };
  
  export const destroySessionService = async (session) => {
    if (session.login) {
      await session.destroy();
    }
  };