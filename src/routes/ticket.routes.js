import { Router } from 'express';
import { ticketController } from '../controllers/ticket.controller.js';

const routerTicket = Router();

routerProduct.get('/:tid', ticketController.getTicketById);
routerProduct.post('/', ticketController.create);

export default routerTicket;