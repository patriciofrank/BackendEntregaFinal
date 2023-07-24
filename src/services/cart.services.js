import { getManagerCarts } from "../dao/daoManager.js";
import { getAvailableStock, updateStock } from "./product.services.js";
import { ticketServices } from "./ticket.services.js";
import { managerUser } from "./user.services.js";

const data = await getManagerCarts();
export const managerCarts = new data.ManagerCartMongoDB;

export const cartServices = {

  purchaseCart: async (cid) => {
    try {
      // Buscar carrito por id
      const cart = await managerCarts.model.findById(cid).populate("products.product");
      if (!cart) throw new Error("Cart not found");

      // Buscar el usuario de ese carrito
      const user = await managerUser.getElementByIdCart(cid);
      if (!user) throw new Error("User not found");

      // Variables para guardar los productos que no pudieron procesarse
      let failedProducts = [];
      let allProcessed = true;

      // Validar disponibilidad de stock para cada producto
      for (let i = 0; i < cart.products.length; i++) {
        const product = cart.products[i].product;
        const quantity = cart.products[i].quantity;
        const availableStock = await getAvailableStock(product._id);

        if (availableStock >= quantity) {
          await updateStock(product._id, availableStock - quantity);
        } else {
          failedProducts.push(product._id);
          allProcessed = false;
        }
      }

      // Si no se pudieron procesar todos los productos, actualizar el carrito
      if (!allProcessed) {
        cart.products = cart.products.filter(product => failedProducts.includes(product.product._id));
        await cart.save();
      } else if(allProcessed) {
        cart.products = [];
        await cart.save();
      }

      // Calcular el amount sumando el precio de todos los productos del carrito
      let amount = 0;
      cart.products.forEach(product => {
        const price = Number(product.product.price);
        const quantity = Number(product.quantity);
        amount += price * quantity;
      });

      // Crear el ticket
      const ticket = {
        code: "TKT" + Date.now(),
        purchase_datetime: new Date(),
        amount: amount,
        purchaser: user.email
      };
      await ticketServices.createTicket(ticket);

      return ticket;
    } catch (error) {
      throw new Error(error.message);
    }
  },


  getCarts: async () => {
    try {
      managerCarts.setConnection();
      const carts = await managerCarts.model.find().populate("products.product");
      return carts;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  getCartById: async (cid) => {
    try {
      managerCarts.setConnection();
      const cart = await managerCarts.model.findById(cid).populate({ path: "products.product", model: "products"});
      if (!cart) throw new Error("Cart not found");
      return cart;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  addCart: async (cartData) => {
    try {
      const cart = await managerCarts.addElement(cartData);
      return cart;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  addProductToCart: async (cid, pid, quantity) => {
    try {
      const cart = await managerCarts.getElementById(cid);
      if (!cart) throw new Error("Cart not found");
      const product = { product: pid, quantity: quantity, id: pid };
      cart.products.push(product);
      await managerCarts.updateElement(cid, cart);
      return cart;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  deleteProductFromCart: async (cid, pid) => {
    try {
      const cart = await managerCarts.getElementById(cid);
      if (!cart) throw new Error("Cart not found");
      cart.products = cart.products.filter(product => product.product != pid);
      await managerCarts.updateElement(cid, cart);
      return cart;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  deleteCart: async (cid) => {
    try {
      const cart = await managerCarts.getElementById(cid);
      if (!cart) throw new Error("Cart not found");
      await managerCarts.deleteElement(cid);
      return { message: "Cart deleted successfully" };
    } catch (error) {
      throw new Error(error.message);
    }
  },

  updateProductQuantity: async (cid, pid, quantity) => {
    try {
      const cart = await managerCarts.getElementById(cid);
      if (!cart) throw new Error("Cart not found");
      cart.products = cart.products.map(product => {
        if (product.product == pid) {
          return { ...product, quantity };
        }
        return product;
      });
      await managerCarts.updateElement(cid, cart);
      return cart;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  updateCartProducts: async (cid, products) => {
    try {
      const cart = await managerCarts.getElementById(cid);
      if (!cart) throw new Error("Cart not found");
      if (!Array.isArray(products)) throw new Error("Invalid request format");

      const updatedProducts = [];

      products.forEach((product) => {
        const index = cart.products.findIndex(
          (p) => p.product === product.product && p.product instanceof ObjectId
        );
        if (index >= 0) {
          const updatedQuantity = cart.products[index].quantity + product.quantity;
          cart.products[index].quantity = updatedQuantity;
          updatedProducts.push(cart.products[index]);
        } else {
          const newProduct = { product: product.product, quantity: product.quantity };
          cart.products.push(newProduct);
          updatedProducts.push(newProduct);
        }
      });

      // Elimina los productos que no estén en el nuevo arreglo
      cart.products = cart.products.filter((product) =>
        updatedProducts.some((updatedProduct) => updatedProduct.product === product.product)
      );

      await managerCarts.updateElement(cid, cart);
      return cart;
    } catch (error) {
      throw new Error(error.message);
    }
  },
}