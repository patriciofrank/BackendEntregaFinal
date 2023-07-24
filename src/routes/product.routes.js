import { Router } from 'express';
import { productController } from '../controllers/product.controller.js';
import { passportCall, authorization } from "../utils/messageErrors.js";

const routerProduct = Router();

routerProduct.get('/', productController.getAllProducts);
routerProduct.get('/:pid', productController.getProductById);
routerProduct.post('/', passportCall('jwt'), authorization('Admin'), productController.addProduct);
routerProduct.delete('/:pid', productController.deleteProduct);
routerProduct.put('/:pid', productController.updateProduct);

export default routerProduct;