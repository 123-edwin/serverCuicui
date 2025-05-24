import { Router } from 'express';
import { getClients, createClient, deleteClient, getOnlyClient, updateClient } from '../controllers/clientsController.js';

const router = Router();

// Concatenar con las rutas anteriores: /api/clients/{get-post-delete}
// Ruta para obtener un cliente
router.get('/get/:id', getOnlyClient);
// Ruta para obtener todos los clientes
router.get('/get', getClients);
// Ruta para agregar un nuevo cliente
router.post('/post', createClient);
// Ruta para actualizar cliente
router.put('/put/:id', updateClient);
// Ruta para eliminar un cliente
router.delete('/delete/:id', deleteClient);



export default router;
