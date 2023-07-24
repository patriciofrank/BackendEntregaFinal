import { ManagerMongoDB } from "../ManagerMongoDB.js";
import { Schema } from "mongoose";

const cartSchema = new Schema({
    products: {
        type: [
        {
            product: { type: Schema.Types.ObjectId, ref: 'products' }, //id_product
            quantity: { type: Number, required: true }
        }
        ],
        default:[],
    }
});

cartSchema.pre('find', function (){
    this.populate('products.product');
})

export class ManagerCartMongoDB extends ManagerMongoDB {
    constructor() {
        super(process.env.MONGODBURL, "carts", cartSchema)
        //Aqui irian los atributos propios de la clase
    }
    //Aqui irian los metodos propios de la clase
}