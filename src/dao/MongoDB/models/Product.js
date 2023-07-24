import { ManagerMongoDB } from "../ManagerMongoDB.js";
import { Schema } from "mongoose";
import paginate from 'mongoose-paginate-v2';

const productSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, index: true },
  thumbnail: { type: String, required: true },
  code: { type: String, required: true },
  stock: { type: Number, required: true },
  status: { type: Boolean, default: true },
  category: { type: String, required: true, index: true },
  owner: { type: String, default: "Admin" },
});

productSchema.plugin(paginate);

export class ManagerProductMongoDB extends ManagerMongoDB {
    constructor() {
        super(process.env.MONGODBURL, "products", productSchema)
        //Aqui irian los atributos propios de la clase
    }
    //Aqui irian los metodos propios de la clase
}