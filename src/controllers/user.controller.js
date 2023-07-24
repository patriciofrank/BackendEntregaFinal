import { getUserById, getUserByEmail, updateUserPassword, updateUserRole, updateUser, getAllUsers, deleteInactiveUsersService } from "../services/user.services.js";

export const getAllUsersController = async (req, res) =>{
    try {
        const users = await getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const createUserController = async (req, res) => {
    try {
        // await createUser(req.body); ya creado con Passport
        res.status(201).send({ status: "success", message: "User created" });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

export const getUserByIdController = async (req, res) => {
    try {
        const user = await getUserById(req.params.id);
        res.status(200).json({ message: user });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

export const getUserByEmailController = async (req, res) => {
    try {
        const user = await getUserByEmail(req.params.email);
        res.status(200).json({ message: user });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

export const resetPasswordController = async (req, res) => {
    try {
        const { newPassword, email } = req.body;

        const user = await getUserByEmail(email);

        if (user.password === newPassword) {
            return res.status(400).send({ message: "La nueva contraseña no puede ser igual a la anterior." });
        }

        // Actualizar la contraseña en la base de datos utilizando updateUserPassword
        await updateUserPassword(user._id, newPassword);

        res.status(201).send({ message: "Contraseña actualizada exitosamente." });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

export const changeRoleController = async (req, res) => {
    try {
        const user = await getUserById(req.params.id);
        console.log(user.rol);
        // Verificar el rol actual del usuario
        let newRole = "";
        if (user.rol === "User") {
            newRole = "Premium";
        } else if (user.rol === "Premium") {
            newRole = "User";
        } else {
            return res.status(400).send({ message: "Rol inválido." });
        }

        // Actualizar el rol del usuario en la base de datos
        await updateUserRole(user._id, newRole);

        res.status(201).send({ message: "Rol actualizado exitosamente." });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

export const uploadDocumentsController = async (req, res) => {
    const userId = req.params.uid;
    const files = req.files;

    try {
        const user = await getUserById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Actualizar el estado de carga de los documentos en el usuario
        user.documents = files.map((file) => ({
            name: file.originalname,
            reference: file.path,
        }));
        await updateUser(userId, user);

        res.status(200).json({ message: "Documents uploaded successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteInactiveUsersController = async (req, res) => {
    try {
        await deleteInactiveUsersService();
        res.status(200).json({ message: "Inactive users deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}