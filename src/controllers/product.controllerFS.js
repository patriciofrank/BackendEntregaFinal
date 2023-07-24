import { ProductManager } from '../dao/FileSystem/ProductManager.js';

export const productManager = new ProductManager('./src/dao/FileSystem/models/productos.txt');

const getAllProducts = async (req, res) => {
  const products = await productManager.getProducts();
  let { limit } = req.query;

  if( limit !== undefined ){
    console.log(products.slice(0, parseInt(limit)));
    res.send(`Lista de productos con limite: ${limit} <br> <code>${JSON.stringify(products.slice(0, parseInt(limit)))}</code>`);
  }else{
    console.log(products);
    res.send(`Lista de productos sin limites:<br> <code>${JSON.stringify(products)}</code>`)
  }
};

const getProductById = async (req, res) => {
  const product = await productManager.getProductById(parseInt(req.params.pid));
  console.log(product);
  res.send(`Resultado búsqueda por id ${req.params.pid}</br><code>${JSON.stringify(product)}</code>`);
};

const addProduct = async (req, res) => {
  const mensaje = await productManager.addProduct(req.body);
  res.send(mensaje);
};

const deleteProduct = async (req, res) => {
  const mensaje = await productManager.deleteProduct(req.params.pid);
  res.send(mensaje);
};

const updateProduct = async (req, res) => {
  const mensaje = await productManager.updateProduct(req.params.pid, req.body);
  res.send(mensaje);
};


export const productController = {
  getAllProducts,
  getProductById,
  addProduct,
  deleteProduct,
  updateProduct,
};