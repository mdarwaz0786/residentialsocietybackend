import CryptoJS from "crypto-js";
import dotenv from "dotenv";
dotenv.config();

const generatePayUPayment = ({
  txnid,
  amount,
  email,
  productinfo,
  firstname,
  phone,
}) => {
  const key = process.env.PAYU_KEY;
  const salt = process.env.PAYU_SALT;
  const surl = `${process.env.BASE_URL}/api/v1/payment/success`;
  const furl = `${process.env.BASE_URL}/api/v1/payment/failure`;

  const hashString = `${key}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|||||||||||${salt}`;
  const hash = CryptoJS.SHA512(hashString).toString();

  const payULink = `https://secure.payu.in/_payment?key=${key}&txnid=${txnid}&amount=${amount}&productinfo=${productinfo}&firstname=${firstname}&email=${email}&phone=${phone}&surl=${surl}&furl=${furl}&hash=${hash}`;

  return { payULink, transactionId: txnid, hash };
};

export default generatePayUPayment;
