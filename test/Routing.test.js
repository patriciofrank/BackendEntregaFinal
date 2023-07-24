import mongoose from "mongoose";
import config from "../src/config/config.js";
import chai from 'chai';
import supertest from 'supertest';

const expect = chai.expect;
const requester = supertest.agent('http://localhost:8080');

await mongoose.connect(process.env.MONGODBURL).then(() => console.log("DB is connected"))

describe("Testing de app ecommerce", () => {

  // TEST para enpoints de Productos
  describe("Testing de rutas de productos", () => {
    it("Pruebo el endopint /api/products que debe devolverme todos los productos", async () => {
      const response = await requester.get('/api/products');
      expect(response.status).to.eql(200);
      expect(response.body.payload).to.be.an('array');
    });
    it("Pruebo el endopint /api/products/:pid que debe devolverme un producto por su id", async () => {
      const pid = "6418d15402a5adcf3cb43b2b";
      const response = await requester.get(`/api/products/${pid}`);
      expect(response.status).to.eql(200);
      expect(response.body).to.be.an('object');
    });
    it("Pruebo el endopint /api/products para agregar un producto", async () => {
      const newProduct = {
        owner: "Admin",
        title: "Producto de prueba",
        description: "Producto de prueba 2",
        price: 100,
        thumbnail: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.istockphoto.com%2Fes%2Ffotos%2Fproducto&psig=AOvVaw0Z2Z3Z4Z2Z3Z2Z3Z2Z3Z2Z3Z2Z3Z2Z3Z2Z3&ust=1629787223454000&source=images&cd=vfe&ved=0CAsQjRxqFwoTCJjQ4ZqH9_ICFQAAAAAdAAAAABAD",
        code: "1111112",
        stock: 10,       
      };
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjY0NTJkODkzZjExOWVlYmIwZWJhNmY0YSIsImZpcnN0X25hbWUiOiJFc3RlYmFuIiwibGFzdF9uYW1lIjoiUGVyZWEiLCJlbWFpbCI6ImVzdGViYW5AZ21haWwuY29tIiwiYWdlIjo0Mywicm9sIjoiQWRtaW4iLCJwYXNzd29yZCI6IiQyYiQxMiROaUw4OVFWQ3pKZzVwUlQuek1PQS91OGlacTlYNWFPNTdpcVE0R01URlpEakFuQjVGT2Y5ZSIsImlkX2NhcnQiOiI2NDUyZDg5M2YxMTllZWJiMGViYTZmNDgiLCJfX3YiOjB9LCJpYXQiOjE2ODcxMTQ2NzUsImV4cCI6MTY4NzE1Nzg3NX0.jAZdgeH_3oQHkLp8e8mfjRrE8Sq-zAAQQobTxCTnk0c'

      const authenticatedRequest = requester.post('/api/products')
      .set('Cookie', `jwtCookie=${token}`)
      .send(newProduct);

      // Realizar la solicitud autenticada
      const response = await authenticatedRequest;
     
      console.log(response.body);
      expect(response.body).to.be.an('object');
    });
  });


  //TEST para enpoints de Carrito
  describe("Testing de rutas de carrito", () => {
    it("Pruebo el endpoint /api/cart que debe devolverme todos los carritos", async () => {
      const response = await requester.get('/api/carts');
      expect(response.status).to.eql(200);
      expect(response.body).to.be.an('array');
    });

    it("Pruebo el endpoint /api/cart/:cid que debe devolverme un carrito por su id", async () => {
      const cid = "641c688b6ffd882307a86176";
      const response = await requester.get(`/api/carts/${cid}`);
      expect(response.status).to.eql(200);
      expect(response.body).to.be.an('object');
    });

    it("Pruebo el endpoint /api/cart para agregar un carrito", async () => {
      const newCart = {
        products: [
          {
            product: "6418d15402a5adcf3cb43b30",
            quantity: 1
          },
          {
            product: "6418d15402a5adcf3cb43b32",
            quantity: 2
          }
        ]
      };
      const response = await requester.post('/api/carts').send(newCart);
      console.log(newCart)
      expect(response.body).to.be.an('object');
    });
  });


  //TEST para enpoints de Usuarios
  describe("Testing de rutas de usuario", () => {
    it("Pruebo el endpoint /user/:id que debe devolverme un usuario por su id", async () => {
      const id = "64284f572781a37d683551d6";
      const response = await requester.get(`/user/${id}`);
      console.log(response.body);
      expect(response.status).to.eql(200);
      expect(response.body).to.be.an('object');
    });

    it("Pruebo el endpoint /user/resetpassword para restablecer la contraseña de un usuario", async () => {
      const resetData = {
        email: "a@assd",
        newPassword: "newPassword123"
      };
      const response = await requester.post('/user/resetpassword').send(resetData);
      expect(response.status).to.eql(200);
      expect(response.body).to.be.an('object');
    });  
    it("Pruebo el endpoint /user/premium/:uid para cambiar el rol de un usuario a premium", async () => {
      const uid = "648fb289a69e0dd942eb5279";
      const response = await requester.put(`/user/premium/${uid}`);
      expect(response.status).to.eql(201);
      expect(response.body).to.be.an('object');
    });
  
  });  
  });