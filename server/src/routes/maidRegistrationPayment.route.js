import express from 'express';
import {
  approveMaidAndGeneratePayment,
  getMaidPayments,
  getMaidRegistrationPayments,
  maidRegistrationPaymentFailure,
  maidRegistrationPaymentSuccess,
} from '../controllers/maidRegistrationPayment.controllers.js';

const router = express.Router();

router.patch(
  '/approve/maid/:status/:id',
  approveMaidAndGeneratePayment,
);

router.get(
  '/get-all-maidRegistrationPayment',
  getMaidRegistrationPayments,
);

router.get(
  '/maid/payments/:id',
  getMaidPayments,
);

router.post(
  '/payment-success',
  maidRegistrationPaymentSuccess,
);

router.post(
  '/payment-failure',
  maidRegistrationPaymentFailure,
);

export default router;
