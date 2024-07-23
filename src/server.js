import express from 'express';
import handlebars from 'express-handlebars';
import path from 'path';
import ProductManager from './routes/productsM.js';
import ViewRouters from './routes/viewsRouters.js';
import { __dirname } from './utilidades.js';


const app = express();
const PORT = process.env.PORT || 8080;

app.engine('handlebars', handlebars.engine());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');


app.use(express.static(path.join(__dirname, 'public')));

const productManager = new ProductManager(path.join(__dirname, 'public', 'product.json'));


app.get('/', async (req, res) => {
    try {
        const products = await productManager.getProductList();
        res.render('home', { products });
    } catch (error) {
        console.error(`Error al cargar los productos: ${error.message}`);
        res.status(500).send('Error al cargar los productos');
    }
});

app.use('/', ViewRouters);

export { app, productManager };
