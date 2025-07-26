import express from 'express';
import { approveTenantAndGeneratePayment, getFlatOwnerPayments, getTenantRegistrationPayments, tenantRegistrationPaymentFailure, tenantRegistrationPaymentSuccess } from '../controllers/tenantRegistrationPayment.controllers.js';

const router = express.Router();

router.patch('/approve/tenant/:status/:id', approveTenantAndGeneratePayment);
router.get('/get-all-tenantRegistrationPayment', getTenantRegistrationPayments);
router.get('/flatOwner/payments/:id', getFlatOwnerPayments);
router.post('/payment-success', tenantRegistrationPaymentSuccess);
router.post('/payment-failure', tenantRegistrationPaymentFailure);

export default router;
