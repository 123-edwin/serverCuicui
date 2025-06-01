import { Router } from "express";
import { stampIncome, stampPayment } from '../controllers/billController.js';

const router = Router();

router.post('/income', stampIncome);
router.post('/payment', stampPayment);

export default router;