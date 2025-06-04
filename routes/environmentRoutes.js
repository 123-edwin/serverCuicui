import {Router} from 'express';
import { configurarEmisor } from '../controllers/environmentController.js';

const router = Router();

router.post('/configurarEmisor', configurarEmisor);

export default router;