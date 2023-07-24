# BackEnd - Comision - 39680
CoderHouse - Curso BackEnd

*Alumno:* **Patricio Agustin Frank**



# ENTREGA PROYECTO FINAL
TIEMPO LIMITE 27/07/2023

**Para ejecutar comando: node server.js**  
**Posibilidad de configurar por comando el puerto de ejecución del servidor:**  
**node server.js --serverPort 8181 o node server.js -p 8181**  
    
##Importante se suve .env solo a modo didactico para poder probar la funcionalidad.  
##Quedan expuestos valores privados como usuarios, contraseñas, rutas y private-keys.  
##No se publica node_modules, reinstalarlos desde package.json con 'npm i'.



>>RUTAS DE LA API:  
De consumo libre sin autenticación, sería conveniente de todos modos incluir al menos todos los métodos PUT, POST, DELETE a la lista de protegidos y dejar solamente los métodos de consulta GET libres al público.    
Rutas de acceso para consulta GET, modificación PUT, inserción POST y eliminación DELETE que conforman el CRUD de datos de la aplicación.  

- GET /api/products
- GET /api/products/:id
- POST /api/products
- DELETE /api/products/:id
- PUT /api/products/:id

- GET /api/carts
- GET /api/carts/:id
- GET /api/cart/user/:id
- POST /api/carts
- DELETE /api/carts/:id
- PUT /api/carts/:id

**Dependecias utilizadas:**  
    "bcrypt": "^5.1.0"  
    "dotenv": "^16.0.3"  
    "express": "^4.18.2"  
    "express-handlebars": "^7.0.7"  
    "express-session": "^1.17.3"  
    "jsonwebtoken": "^9.0.0"  
    "log4js": "^6.9.1"  
    "mongodb": "^5.5.0"  
    "socket.io": "^4.6.1"  
    "yargs": "^17.7.2"  
