import { Router } from 'express';
import { cartController } from '../controllers/cart.controller.js';

const routerCart = Router();

routerCart.get('/', cartController.getCarts);//ok
routerCart.get('/:cid', cartController.getCartById);//ok
routerCart.post('/', cartController.addCart);//ok
routerCart.post('/:cid/product/:pid', cartController.addProductToCart);//ok
routerCart.delete('/:cid/product/:pid', cartController.deleteProductFromCart);//ok
routerCart.delete('/:cid', cartController.deleteCart);//ok
routerCart.put('/:cid/product/:pid', cartController.updateProductQuantity);//ok
routerCart.put('/:cid', cartController.updateCartProducts);//ok
routerCart.post('/:cid/purchase', cartController.purchaseCart);

export default routerCart;