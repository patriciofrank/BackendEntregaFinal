import { productController } from "./product.controller.js";

const productsGetAll = async (req, res) => {
    const products = await productController.getAllProducts();
    res.render('home', {
        products
    });
}

const realtimeProducts = (req, res) => {
    res.render('realtimeProducts', {})
};

// ------------------------------------------------------------------

const login = (req, res) => {
    res.render('login',{});
};

const register = (req, res) => {
    res.render('register',{});
};


const products = async (req, res) => {
    res.render('products', {
        
    });
};

const chat = async (req, res, next) => {
    res.render('message', {
    });
}


const info = (req, res) => {
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

export default {
    productsGetAll,
    realtimeProducts,
    login,
    register,
    products,
    chat,
    info
}