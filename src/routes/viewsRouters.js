
import { Router } from 'express';
import ProductManager from './productsM.js';
import path from 'path';
import { fileURLToPath } from 'url';

const router = Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const productManager = new ProductManager(path.join(__dirname, '../public/product.json'));

router.get('/realtimeproducts', async (req, res) => {
    try {
        const products = await productManager.getProductList();
        res.render('realTimeProducts', { products });
    } catch (error) {
        console.error(`Error al cargar los productos: ${error.message}`);
        res.status(500).send('Error al cargar los productos');
    }
});

export default router;