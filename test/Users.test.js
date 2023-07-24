import config from '../src/config/config.js';
import mongoose from "mongoose";
import { ManagerUserMongoDB } from "../src/dao/MongoDB/models/User.js";
import Assert from 'assert'

await mongoose.connect(process.env.MONGODBURL).then(() => console.log("DB is connected"))

const assert = Assert.strict;

describe("Testing User", () => {

  before(async function () {
    this.managerUser = new ManagerUserMongoDB();
  });

  beforeEach(function () {
    this.timeout(6000);
  });

  it("Consultar todos los usuarios de mi BBD", async function () {
    try {
      const resultado = await this.managerUser.getElements();
      assert.strictEqual(Array.isArray(resultado), true);
      console.log(resultado);
    } catch (error) {
      throw error;
    }
  });

  it("Crear un nuevo usuario", async function () {
    const newUser = {
      first_name: "Peter",
      last_name: "Perez",
      email: "peter@per.com",
      age: 20,
      rol: "user",
      password: "1234",
    }
    try {
      const resultado = await this.managerUser.addElement(newUser)
      assert.ok(resultado._id) //Reviso si se guardo correctamente el usuario
    } catch (error) {
      throw error;
    }

  })

  it("Consultar a un usuario dado su email", async function () {
    const email = "patricio-agustin@hotmail.com"
    try {
      const user = await this.managerUser.getElementByEmail({ email: email })
      assert.strictEqual(typeof user, 'object')
    } catch (error) {
      throw error;
    }
  })
});