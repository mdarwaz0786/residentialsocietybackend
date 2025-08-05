import express from 'express';
import {
  approveMaidAndGeneratePayment,
  getMaidPayments,
  getMaidRegistrationPayments,
  maidRegistrationPaymentFailure,
  maidRegistrationPaymentSuccess,
} from '../controllers/maidRegistrationPayment.controllers.js';
import isLoggedIn from "../middlewares/auth.middleware.js";

const router = express.Router();

router.patch(
  '/approve/maid/:status/:id',
  isLoggedIn,
  approveMaidAndGeneratePayment,
);

router.get(
  '/get-all-maidRegistrationPayment',
  isLoggedIn,
  getMaidRegistrationPayments,
);

router.get(
  '/maid/payments/:id',
  isLoggedIn,
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
