import fs from 'node:fs';

class ProductManager {
    constructor(path) {
        this.path = path;
        this.productList = [];
    }

    async getProductById(id) {
        try {
            await this.getProductList();
            const product = this.productList.find(product => product.id === id);
            if (!product) {
                throw new Error('Producto no encontrado');
            }
            return product;
        } catch (error) {
            console.error(`Error: ${error.message}`);
            throw error;
        }
    }

    async getProductList() {
        try {
            const data = await fs.promises.readFile(this.path, 'utf-8');
            this.productList = JSON.parse(data);
            return this.productList;
        } catch (error) {
            console.error(`Error: ${error.message}`);
            throw error;
        }
    }

  
    generarID() {
            return Math.random().toString(18)
         
        }


    async addProduct(product) {
        try {
            await this.getProductList();
            
            const newProduct = {
                id: this.generarID(),
                status: true,
                ...product
            };

            const requiredF = ['Titulo', 'description', 'code', 'price', 'stock', 'category'];
            for (const field of requiredF) {
                if (!newProduct[field]) {
                    throw new Error(`El campo ${field} es obligatorio`);
                }
            }

            this.productList.push(newProduct);
            await fs.promises.writeFile(this.path, JSON.stringify(this.productList, null, 2));
        } catch (error) {
            console.error(`Error: ${error.message}`);
            throw error;
        }
    }


    async updateProductById(id, productUpdate) {
        try {
            await this.getProductList();
            const productIndex = this.productList.findIndex(product => product.id === id);

            if (productIndex === -1) {
                throw new Error('Producto no encontrado');
            }

            this.productList[productIndex] = { ...this.productList[productIndex], ...productUpdate };
            await fs.promises.writeFile(this.path, JSON.stringify(this.productList, null, 2));
        } catch (error) {
            console.error(`Error: ${error.message}`);
            throw error;
        }
    }

    async deleteProductById(id) {
        try {
            await this.getProductList();
            this.productList = this.productList.filter(product => product.id !== id);
            await fs.promises.writeFile(this.path, JSON.stringify(this.productList, null, 2));
        } catch (error) {
            console.error(`Error: ${error.message}`);
            throw error;
        }
    }

}

export default ProductManager