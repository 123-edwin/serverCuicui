import 'dotenv/config';  
import express from 'express';
import cors from 'cors';
import clientRoutes from './routes/clientRoutes.js';
import billRoutes from './routes/billRoutes.js';
import environmentRoutes from './routes/environmentRoutes.js';
import mailRoutes from './routes/mailRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
// Opciones de CORS
const corsOptions = {
  origin: 'http://localhost:5173'
};
app.use(cors(corsOptions));

// Importar rutas
app.use('/clients', clientRoutes);
app.use('/bill', billRoutes);
app.use('/environment', environmentRoutes);
app.use('/mail', mailRoutes);

// Inicia el servidor
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
