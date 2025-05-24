import 'dotenv/config';  
import express from 'express';
import cors from 'cors';
import clientRoutes from './routes/clientRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
// Opciones de CORS
const corsOptions = {
  origin: 'https://123-edwin.github.io'
};
app.use(cors(corsOptions));

// Importa y usa tus rutas
app.use('/api/clients', clientRoutes);

// Inicia el servidor
app.listen(PORT, () => {
  console.log('Server running on http://localhost:8080');
});
