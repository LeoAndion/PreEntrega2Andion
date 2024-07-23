import { Server } from 'socket.io';
import { productManager } from './server.js'; 

const io = new Server();

const setupSocketIO = (httpServer) => {
    io.attach(httpServer);

    io.on('connection', async (socket) => {
        console.log('User conectado');
        try {
            const products = await productManager.getProductList();
            socket.emit('updateProducts', products);
        } catch (error) {
            console.error(`Error: ${error.message}`);
        }

        socket.on('addProduct', async (newProduct) => {
            try {
                await productManager.addProduct(newProduct);
                const products = await productManager.getProductList();
                io.emit('updateProducts', products);
            } catch (error) {
                console.error(`Error: ${error.message}`);
            }
        });

        socket.on('deleteProduct', async (id) => {
            try {
                await productManager.deleteProductById(id);
                const products = await productManager.getProductList();
                io.emit('updateProducts', products);
            } catch (error) {
                console.error(`Error al borrar el producto: ${error.message}`);
            }
        });

        socket.on('mensaje', (data) => {
            conversacion.push(data);
            io.emit('conversacion', conversacion);
        });

        socket.on('nuevoUsuario', (nuevoUsuario) => {
            usuarios.push(nuevoUsuario);
            socket.emit('conversacion', conversacion);
            io.emit('conectados', usuarios);
        });

        socket.on('disconnect', (usuario) => {
            const index = usuarios.indexOf(usuario);
            if (index > -1) {
                usuarios.splice(index, 1);
                io.emit('conectados', usuarios);
            }
        });
    });
};

export default setupSocketIO;
