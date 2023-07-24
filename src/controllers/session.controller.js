import { getSessionService, testLoginService, destroySessionService } from "../services/session.services.js";
import { managerUser } from '../services/user.services.js';

export const getSession = async (req, res) => {
    try {
        if (req.session.login) {
            return res.redirect("/products", 200, { message: "Bienvenido/a a mi tienda" });
        }
        res.redirect("/api/session/login", 500, { message: "Por favor inicie sesión" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const testLogin = async (req, res) => {
    try {
        const user = req.user;
        const sessionData = await testLoginService(user);
        res.status(200).json({ status: "success", payload: sessionData });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const destroySession = async (req, res) => {
    try {
        const user = req.user; // Obtiene el usuario de la sesión

        if (user) {
            user.last_connection = new Date(); // Actualiza la última conexión al iniciar sesión
            await managerUser.updateElement(user.id, user); // Guarda los cambios en el usuario
        }

        await destroySessionService(req.session);
        res.redirect("/products", 200, { divMessage: "Hasta luego" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};