import fs from 'node:fs';

class CartManager {
    constructor(path) {
        this.path = path;
        this.carts = [];
    }

 async addProductToCart(id, productId) {
        try {
            await this.getCarts();
            const cartIndex = this.carts.findIndex(cart => cart.id === id);

            if (cartIndex === -1) {
                throw new Error('carrito no encontrado');
            }

            const productIndex = this.carts[cartIndex].products.findIndex(prod => prod.id === productId);

            if (productIndex === -1) {
                this.carts[cartIndex].products.push({ id: productId, quantity: 1 });
            } else {
                this.carts[cartIndex].products[productIndex].quantity += 1;
            }

            await fs.promises.writeFile(this.path, JSON.stringify(this.carts, null, 2));
        } catch (error) {
            console.error(`Error al agregar el producto : ${error.message}`);
            throw error;
        }
    }



    async getCarts() {
        try {
            const data = await fs.promises.readFile(this.path, 'utf-8');
            this.carts = JSON.parse(data);
            return this.carts;
        } catch (error) {
            console.error(`Error: ${error.message}`);
            throw error;
        }
    }

    async createCart() {
        try {
            await this.getCarts();
            const newCart = {
                id: this.generarID(),
                products: []
            };
            this.carts.push(newCart);
            await fs.promises.writeFile(this.path, JSON.stringify(this.carts, null, 2));
            return newCart;
        } catch (error) {
            console.error(`Error al crear carrito: ${error.message}`);
            throw error;
        }
    }
    generarID() {
        return Math.random().toString(18)
    }

    async getCartById(cartId) {
        try {
            const carts = await this.getCarts();
            const cart = carts.find(cart => cart.id === cartId);
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }
            return cart;
        } catch (error) {
            console.error(`Error al obtener carrito por ID: ${error.message}`);
            throw error;
        }
    }
    



    

}

export default CartManager;
