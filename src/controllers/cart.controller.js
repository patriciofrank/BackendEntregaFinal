import { cartServices, managerCarts } from "../services/cart.services.js";


export const cartController = {

  purchaseCart: async (req, res) => {
    managerCarts.setConnection();
    const { cid } = req.params;
    try {
      const ticket = await cartServices.purchaseCart(cid);
      res.status(201).json(ticket);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  getCarts: async (req, res) => {
    try {
      managerCarts.setConnection();
      const carts = await managerCarts.model.find().populate("products.product");
      // console.log(JSON.stringify(carts));
      res.status(200).json(carts);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  getCartById: async (req, res) => {
    const { cid } = req.params;
    try {
      managerCarts.setConnection();
      const cart = await managerCarts.model.findById(cid).populate({ path: "products.product", model: "products"});
      if (!cart) throw new Error("Cart not found");
      // console.log(JSON.stringify(cart));
      res.status(200).json(cart);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  },

  addCart: async (req, res) => {
    try {
      const cart = await managerCarts.addElement(req.body);
      res.status(201).json(cart);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  addProductToCart: async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    try {
      const cart = await managerCarts.getElementById(cid);
      if (!cart) throw new Error("Cart not found");
      const product = { product: pid, quantity: quantity, id: pid };
      cart.products.push(product);
      await managerCarts.updateElement(cid, cart);
      res.status(200).json(cart);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  },

  deleteProductFromCart: async (req, res) => {
    const { cid, pid } = req.params;
    try {
      const cart = await managerCarts.getElementById(cid);
      if (!cart) throw new Error("Cart not found");
      cart.products = cart.products.filter(product => product.product != pid);
      await managerCarts.updateElement(cid, cart);
      res.status(200).json(cart);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  },

  deleteCart: async (req, res) => {
    const { cid } = req.params;
    try {
      const cart = await managerCarts.getElementById(cid);
      if (!cart) throw new Error("Cart not found");
      await managerCarts.deleteElement(cid);
      res.status(200).json({ message: "Cart deleted successfully" });
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  },

  updateProductQuantity: async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
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
      res.status(200).json(cart);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  },

  updateCartProducts: async (req, res) => {
    const { cid } = req.params;
    try {
      const cart = await managerCarts.getElementById(cid);
      if (!cart) throw new Error("Cart not found");
      const { products } = req.body;
      if (!Array.isArray(products)) throw new Error("Invalid request format");
      // crea una nuevo array para almacenar los productos actualizados
      const updatedProducts = [];
      // recorre los nuevos productos y actualiza las cantidades de productos existentes o agrega nuevos productos
      products.forEach((product) => {
        const index = cart.products.findIndex((p) => p.product === product.product && p.product instanceof ObjectId);
        if (index >= 0) {
          // Si el producto ya existe actualiza la cantidad
          const updatedQuantity = cart.products[index].quantity + product.quantity;
          // crea un nuevo producto con la cantidad actualizada pero mantiene el id del producto existente
          const updatedProduct = { product: cart.products[index].product, quantity: updatedQuantity };
          updatedProducts.push(updatedProduct);
        } else {
          // Si el producto no existe lo agrega al array
          updatedProducts.push(product);
        }
      });
      // Actualiza el carrito con el nuevo array de productos
      cart.products = updatedProducts;
      await managerCarts.updateElement(cid, cart);
      res.status(200).json({ message: "Cart products updated successfully" });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}