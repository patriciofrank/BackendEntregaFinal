import { getAllProducts, getProductById, addProduct, updateProduct, deleteProduct } from "../services/product.services.js";
import CustomError from "../utils/errors/CustomError.js";
import EErrors from "../utils/errors/enums.js";
import { generateProductErrorInfo } from "../utils/errors/info.js";

export const productController = {
  getAllProducts: async (req, res) => {
    try {
      const result = await getAllProducts(req.query);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ status: "error", message: error.message });
    }
  },
  getProductById: async (req, res) => {
    try {
      const { pid } = req.params;
      const product = await getProductById(pid);
      res.status(200).json(product);
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal server error");
    }
  },
  addProduct: async (req, res) => {
    try {
      const { title, description, price, thumbnail, code, stock, status, category } = req.body;
      if (!title || !description || !price || !thumbnail || !code || !stock || !category) {
        CustomError.createError({
          name: "Product creation error",
          cause: generateProductErrorInfo({ title, description, price, thumbnail, code, stock, category }),
          message: "Error trying to create Product",
          code: EErrors.INVALID_TYPES_ERROR
        })
      }
      const newProduct = {
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
        status,
        category,
      };
      const product = await addProduct(newProduct);
      res.status(201).json(product);
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal server error");
    }
  },
  updateProduct: async (req, res) => {
    try {
      const { pid } = req.params;
      const { title, description, price, thumbnail, code, stock, status, category } = req.body;
      const updatedProduct = {
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
        status,
        category,
      };
      const product = await updateProduct(pid, updatedProduct);
      res.status(200).json(product);
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal server error");
    }
  },
  deleteProduct: async (req, res) => {
    try {
      const { pid } = req.params;
      const product = await deleteProduct(pid);
      res.status(200).json(product);
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal server error");
    }
  },
};