import { Router } from "express";
import routerProduct from "./product.routes.js";
import routerCart from "./cart.routes.js";
import routerUser from "./user.routes.js";
import routerSession from "./session.routes.js";
import routerGithub from "./github.routes.js";


const router = Router()

router.use('/api/products', routerProduct);
router.use('/api/carts', routerCart);
router.use('/api/users', routerUser);
router.use('/api/session', routerSession)
router.use('/session', routerGithub)

export default router