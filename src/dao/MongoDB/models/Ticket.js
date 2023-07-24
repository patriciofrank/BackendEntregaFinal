import { ManagerMongoDB } from '../ManagerMongoDB.js';
import { Schema } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const ticketSchema = new Schema({
  code: { type: String, required: true, unique: true },
  purchase_datetime: { type: Date, required: true },
  amount: { type: Number, required: true, index: true },
  purchaser: { type: String, required: true}
});

// Agregar el plugin uniqueValidator al esquema
ticketSchema.plugin(uniqueValidator);

export class ManagerTicketMongoDB extends ManagerMongoDB {
    constructor() {
        super(process.env.MONGODBURL, "tickets", ticketSchema)
    }
}