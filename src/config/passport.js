import local from 'passport-local';
import passport from 'passport';
import jwt from 'passport-jwt';
import GitHubStrategy from 'passport-github2';
import { managerUser } from '../services/user.services.js';
import { managerCarts } from '../services/cart.services.js';
import { createHash, validatePassword } from '../utils/bcrypt.js';
import { generateToken } from "../utils/jwt.js";
import CustomError from "../utils/errors/CustomError.js";
import EErrors from "../utils/errors/enums.js";
import { generateUserErrorInfo } from "../utils/errors/info.js";

//Passport se va a trabajar como un middleware
const LocalStrategy = local.Strategy; //Defino mi estrategia

const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

const initializePassport = () => {

    const cookieExtractor = req => {
        const token = req.cookies ? req.cookies.jwtCookie : {}
        return token
    }

    //Definir donde se aplican mis estrategias    

    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]), //Extrae el token desde las cookies
        secretOrKey: process.env.PRIVATE_KEY_JWT
    }, async (jwt_payload, done) => {
        try {
            return done(null, jwt_payload)
        } catch (error) {
            return done(error)
        }

    }));

    passport.use('register', new LocalStrategy(
        { passReqToCallback: true, usernameField: 'email' }, async (req, username, password, done) => {
            const { first_name, last_name, email, age } = req.body
            try {
                if (!first_name || !last_name || !email) {
                    CustomError.createError({
                        name: "User creation error",
                        cause: generateUserErrorInfo({ first_name, last_name, email }),
                        message: "Error trying to create User",
                        code: EErrors.INVALID_TYPES_ERROR
                    })
                }
                const userExists = await managerUser.getElementByEmail(username)
                if (userExists) {
                    return done(null, false)
                }
                const passwordHash = createHash(password)
                //crear el carrito 
                const cart = await managerCarts.addElement({ products: [] });

                const user = await managerUser.addElement({
                    first_name: first_name,
                    last_name: last_name,
                    email: email,
                    age: age,
                    password: passwordHash,
                    id_cart: cart._id
                })
                const accessToken = generateToken(user)
                console.log(accessToken)
                const data = { user, accessToken }
                return done(null, data);
                // return done(null, userCreated)
            } catch (error) {
                return done(error)
            }
        }))

    //Inicializar la session del user
    passport.serializeUser(( {user} , done) => {
        done(null, user._id);
    })

    //Eliminar la session del user
    passport.deserializeUser(async (id, done) => {
        const user = await managerUser.getElementById(id)
        done(null, user)
    })

    passport.use('login', new LocalStrategy({ usernameField: 'email' }, async (username, password, done) => {

        try {
            const user = await managerUser.getElementByEmail(username)

            if (!user) { //Usuario no encontrado
                return done(null, false)
            }
            if (validatePassword(password, user.password)) { //Usuario y contraseña validos
                user.last_connection = new Date(); // Actualiza la última conexión al iniciar sesión
                await managerUser.updateElement(user.id, user); // Guarda los cambios en el usuario

                const accessToken = generateToken(user)
                console.log(accessToken)
                const data = { user, accessToken }
                return done(null, data);
            }

            return done(null, false) //Contraseña no valida

        } catch (error) {
            return done(error)
        }
    }))

    passport.use('github', new GitHubStrategy({
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: process.env.CALLBACK_URL
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            console.log(profile);
            const user = await managerUser.getElementByEmail(profile._json.email);
            if (user) {
                done(null, user)
            } else {
                const userCreated = await managerUser.addElement({
                    first_name: profile._json.name,
                    last_name: '',
                    email: profile._json.email,
                    age: 20,
                    password: ''
                })
                done(null, userCreated)
            }
        } catch (error) {
            return done(error)
        }
    }))

}

export default initializePassport