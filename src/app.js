import config from './config/config.js';
import express from 'express';
import session from 'express-session';
import cookieParser from "cookie-parser";
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express';
import MongoStore from 'connect-mongo';
import passport from 'passport'
import nodemailer from 'nodemailer';
import { productManager } from "./controllers/product.controllerFS.js";
import fileDirName from './utils/path.js';
import { engine } from 'express-handlebars';
import * as path from 'path';
import { Server }  from 'socket.io';
import mongoose from 'mongoose';
import { getManagerMessages } from "./dao/daoManager.js";
import initializePassport from './config/passport.js'
import router from './routes/routes.js';
import compression from 'express-compression';
import errorHandler from './middlewares/errors/index.js';
import { productsMocks } from './mocks/faker-products.js';
import { addProducts } from './services/product.services.js';
import { addLogger } from './utils/logger.js';
import { generateResetToken, isTokenExpired } from './services/password.services.js';
import cors from 'cors';

// import { create } from './express-handlebars'; para servers mas complejos

const app = express();

const { __dirname } = fileDirName(import.meta);


//Middlewares
app.use(compression({ brotli: { enabled: true, zlib: { } } }))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.resolve(__dirname, './views'));
app.use(errorHandler);

//CORS
app.use(cors());

//logger
app.use(addLogger)
const ejemploError = 'Este es un error de ejemplo'
app.get("/loggerTest", (req, res) => {
  req.logger.fatal('Se produjo un error crítico. La aplicación se cerrará.'); // Un error crítico que impide el funcionamiento de la aplicación y requiere terminarla inmediatamente.
  req.logger.error('Error al procesar la solicitud:', ejemploError); // Un error ocurrido durante el procesamiento de una solicitud.
  req.logger.warning('Advertencia: La capacidad del sistema está casi al límite.'); // Una advertencia sobre un posible problema o situación límite.
  req.logger.info(`Se ha recibido una solicitud ${req.method} en la ruta ${req.url}.`); // Información general sobre una acción o evento importante.
  req.logger.http(`Solicitud ${req.method} recibida en la ruta ${req.url}.`,  req.body ); // Registro específico de solicitudes HTTP, incluyendo detalles como la ruta y el cuerpo de la solicitud.
  req.logger.debug(`Variable X ejemplo:', ${new Date().toLocaleTimeString()}`); // Información útil para depurar y analizar el flujo de la aplicación durante el desarrollo.

  res.send("Test Logger")
})

//Cookies
app.use(cookieParser(process.env.PRIVATE_KEY_JWT));

//Session
app.use(session({
  store: MongoStore.create({
      mongoUrl: process.env.MONGODBURL,
      mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
      ttl: 180,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true
}))

//Passport
initializePassport()
app.use(passport.initialize())
app.use(passport.session())

//Routes
app.use('/', router)
app.use('/', express.static(__dirname + '/public'));

//Ruta para generar 100 productos con mocks
app.get('/mockingproducts', async (req, res) => {
  try {
    const products = productsMocks
    // console.log(products);
    await addProducts(products);
    res.send("Productos agregados Mocks")
  } catch (error) {
    res.send(error);
  }
})

//Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: "E-commerce API",
      description: "API e-commerce para el proyecto del curso de Backend de Coderhouse",
    }
  },
  apis: [`${__dirname}/docs/**/*.yaml`],
};

const specs = swaggerJSDoc(swaggerOptions);
app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

//Rutas de cookies
app.get('/setCookie', (req, res) =>{
  res.cookie('CookieEcommerce', 'Esta es una cookie del e-commerce', {maxAge: 10000}).send('Cookie')
})

app.get('/setSignedCookie', (req, res) =>{
  res.cookie('SignedCookie', 'Esta es una cookie del e-commerce firmada', {maxAge: 10000, signed: true}).send('Cookie Firmada')
})

app.get('/getCookie', (req, res) => {
  res.send(req.cookies)
})

app.get('/getSignedCookie', (req, res) => {
  res.send(req.signedCookies)
})

app.get('/deleteCookie', (req, res) => {
  res.clearCookie('CookieEcommerce').send('Cookie removed')
})

app.get('/', async (req, res) => {
  const products = await productManager.getProducts();

  res.render('index', {
    products
  });
})

app.get('/realtimeproducts', async (req, res) => {
  res.render('realTimeProducts', {
  });
})

app.get('/chat', async (req, res) => {
  res.render('chat', {
  });
})

app.get('/products', async (req, res) => {
  res.render('products', {
  });
})

app.get('/register', async (req, res) => {
  res.render('register', {
  });
})

app.get('/login', async (req, res) => {
  res.render('login', {
  });
})

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

const tokenStore = {}; // Objeto para almacenar los tokens generados

//Restablecer password de usuario
app.get('/mail', async (req, res) => {
  const { email } = req.query;
  const { token, timestamp } = generateResetToken(email);
  
  res.cookie('resetToken', { token, timestamp }, { maxAge: 3600000 }); // Configurar la cookie con el nombre "resetToken" y una duración de 1 hora

  const resultado = await transporter.sendMail({
    from: 'Ecommerce',
    to: 'estebanperea@gmail.com',
    subject: 'Restablecer contraseña',
    html: '<h1>Restablecer contraseña</h1><p>Para restablecer tu contraseña, haz click en el siguiente enlace:</p><a href="http://localhost:8080/resetpassword">Restablecer contraseña</a>',
    attachments: [],
  });
  res.send('Para restablecer la contraseña se le ha enviado un email a su casilla de correo, por favor revise su bandeja de entrada');
})

app.get('/resetpassword', async (req, res) => {
  const { resetToken } = req.cookies;
  
  if (!resetToken || isTokenExpired(resetToken.timestamp)) {
    return res.redirect('http://localhost:8080/login');
  }
  
  res.clearCookie('resetToken'); // Eliminar la cookie después de verificarla, si lo deseas
  
  res.render('resetPassword', {});
});


app.set("port", process.env.PORT || 8080)

const server = app.listen(app.get("port"), () => console.log(`Server on port ${app.get("port")}`))

const io = new Server(server)

const data = await getManagerMessages()
const managerMessage = new data.ManagerMessageMongoDB;

io.on("connection", async (socket) => {
  console.log("Cliente conectado");
  socket.on("message", async (info) => {
    managerMessage.addElement(info).then(() => {
        managerMessage.getElements().then((mensajes) => {
            socket.emit("allMessages", mensajes)
        })
    })
})

  socket.broadcast.emit('evento-admin', 'Hola desde server sos el Admin')

  socket.emit('evento-general', "Hola a todos los usuarios")

  const products = await productManager.getProducts();
  
  socket.emit('ListProducts', products);

  socket.on('addProduct', async data => {
    socket.emit('ListProducts', await productManager.getProducts());
  })

  socket.on('deleteProduct', async data => {
    socket.emit('ListProducts', await productManager.getProducts());
  })
  
})