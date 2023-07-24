import { ManagerMongoDB } from "../ManagerMongoDB.js";
import { Schema } from "mongoose";
import nodemailer from 'nodemailer';

const userSchema = new Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        // required: true
    },
    email: {
        type: String,
        unique: true,
        index: true
    },
    age: {
        type: Number,
        required: true
    },
    rol: {
        type: String,
        default: "User"
    },
    password: {
        type: String,
        // required: true
    },
    id_cart: {
        type: Schema.Types.ObjectId,
        ref: 'carts',
    },
    documents: [
        {
            name: { //nombre del documento
                type: String,
                required: true
            },
            reference: { // link al documento
                type: String,
                required: true
            }
        }
    ],
    last_connection: {
        type: Date
    }
})


class UserDTO {
    constructor(first_name, last_name, email, rol) {
        this.first_name = first_name;
        this.last_name = last_name;
        this.email = email;
        this.rol = rol;
    }
}

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
        authMethod: 'LOGIN',
    },
});

export class ManagerUserMongoDB extends ManagerMongoDB {
    constructor() {
        super(process.env.MONGODBURL, "users", userSchema)

    }

    async getAllUserDTOs() {
        super.setConnection();
        try {
            const users = await this.model.find();
            const userDTOs = users.map(user => {
                const { first_name, last_name, email, rol } = user;
                return new UserDTO(first_name, last_name, email, rol);
            });
            return userDTOs;
        } catch (error) {
            return error;
        }
    }

    async getElementByEmail(email) {
        super.setConnection()
        try {
            return await this.model.findOne({ email: email })
        } catch (error) {
            return error
        }
    }

    async getElementByIdCart(id_cart) {
        super.setConnection()
        try {
            return await this.model.findOne({ id_cart: id_cart })
        } catch (error) {
            return error
        }
    }

    async updateUserPassword(id, newPassword) {
        super.setConnection();
        try {
            return await this.model.findByIdAndUpdate(id, { password: newPassword }, { new: true });
        } catch (error) {
            return error;
        }
    }

    async updateUserRole(id, newRole) {
        super.setConnection();
        try {
            return await this.model.findByIdAndUpdate(id, { rol: newRole });
        } catch (error) {
            return error;
        }
    }

    async deleteInactiveUsers() {
        super.setConnection();
        try {
            const idleTimeAllowed = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000); // Obtener la fecha/hora hace dos días
            const deletedUsers = await this.model.find({ last_connection: { $lt: idleTimeAllowed } });
            await this.model.deleteMany({ last_connection: { $lt: idleTimeAllowed } });

            // Enviar correo electrónico a los usuarios eliminados
            for (const user of deletedUsers) {

                const mailOptions = {
                    from: 'Ecommerce',
                    to: user.email,
                    subject: 'Baja por inactividad',
                    html: '<p>Tu cuenta ha sido eliminada debido a inactividad. Para volver a ingresar con su usuario debera volver a registrarse haciendo click en el siguiente enlace:</p><a href="http://localhost:8080/register">Registrarse</a>',
                };

                await transporter.sendMail(mailOptions);
            }

            return true; // Éxito al eliminar los usuarios inactivos
        } catch (error) {
            return error;
        }
    }

}