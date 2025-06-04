import { Router } from "express";
import { stampIncome, stampPayment } from '../controllers/billController.js';

const router = Router();

//Ruta de ingreso
router.post('/income', stampIncome);
//Ruta de pago
router.post('/payment', stampPayment);

export default router;