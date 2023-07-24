import { getManagerTickets } from "../dao/daoManager.js";

const data = await getManagerTickets();
const managerTickets = new data.ManagerTicketMongoDB;

export const ticketServices = {

  createTicket: async (ticketData) => {
    try {
      const ticket = await managerTickets.addElement(ticketData);
      return ticket;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  getTicketById: async (id) => {
    try {
      const ticket = await managerTickets.getElementById(id);
      if (!ticket) {
        throw new Error(`Ticket with id ${id} not found`);
      }
      return ticket;
    } catch (error) {
      throw new Error(error.message);
    }
  }

}