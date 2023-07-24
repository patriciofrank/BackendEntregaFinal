import { Router } from "express";
import viewsController from "../controllers/views.controller.js";

const routerView = Router();

// ------------------------------------------------


routerView.get('/', viewsController.login);

routerView.get('/realtimeProducts', viewsController.realtimeProducts);

// ------------------------------------------------


routerView.get('/login', viewsController.login);


routerView.get('/register', viewsController.register );


routerView.get('/products', viewsController.products);


routerView.get('/info', viewsController.info);

export default routerView;