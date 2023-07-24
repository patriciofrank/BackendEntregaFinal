import { ticketServices } from "./ticket.services.js";

export const ticketController = {
  create: async (req, res) => {
    try {
      const ticket = await ticketServices.createTicket(req.body);
      res.status(201).json(ticket);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  getTicketById: async (req, res) => {
    try {
      const { id } = req.params;
      const ticket = await ticketServices.getTicketById(id);
      res.status(200).json(ticket);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
};