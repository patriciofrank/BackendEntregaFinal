import { Router } from "express";
import {login,products,realtimeProducts,register,info} from "../controllers/views.controller.js";

const routerView = Router();

// ------------------------------------------------


routerView.get('api/', login);

routerView.get('api/realtimeProducts', realtimeProducts );

// ------------------------------------------------


routerView.get('api/login', login);


routerView.get('api/register', register );


routerView.get('api/products', products);


routerView.get('api/info', info);

export default routerView;