import { productController } from "./product.controller.js";

export const productsGetAll = async (req, res) => {
    const products = await productController.getAllProducts();
    res.render('home', {
        products
    });
}

export const realtimeProducts = (req, res) => {
    res.render('realtimeProducts', {})
};

// ------------------------------------------------------------------

export const login = (req, res) => {
    res.render('login',{});
};

export const register = (req, res) => {
    res.render('register',{});
};


export const products = async (req, res) => {
    res.render('products', {
        
    });
};

export const chat = async (req, res, next) => {
    res.render('message', {
    });
}


export const info = (req, res) => {
    res.json({
        server: {
            name: process.title,
            nodeVersion: process.version,
            pid: process.pid,
            uptime: process.uptime(),
            memoryUsage: process.memoryUsage(),
            platform: process.platform,
            architecture: process.arch
        }
    })
};

