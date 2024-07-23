import { app } from './server.js';
import setupSocketIO from './socket.js';

const PORT = process.env.PORT || 8080;

const httpServer = app.listen(PORT, () => {
    console.log(`Funcionando  ${PORT}`);
});

setupSocketIO(httpServer);
