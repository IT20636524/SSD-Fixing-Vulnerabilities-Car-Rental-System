const router = require("express").Router();
const Payment = require("../models/Payment");

//CREATE PAYMENT
router.post("/", async (req, res) => {
    const newPayment = new Payment(req.body);
  
    let code = 1;
    try {
      const paymentcount = await Payment.find().sort({_id:-1}).limit(1)
      if(paymentcount.length > 0)
        code += paymentcount[0].code
        newPayment.payment_id = 'PID00'+ code;
        newPayment.code = code;
  
        try {
          const savedPayment = await newPayment.save();
          res.status(200).json(savedPayment);
        } catch (err) {
          res.status(500).json(err);
        }
  
    } catch (error) {
      console.log(error)
    }
  
  });
  

//GET PAYMENT
router.get("/:payment_id", async (req, res) => {
  try {
    //fix Nosql injection
    let query = { payment_id: req.params.payment_id.toString()};
    const payment = await Payment.findOne(query);
    res.status(200).json(payment);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET ALL PAYMENTS
router.get("/", async (req, res) => {
    try {
      const payment = await Payment.find();
      res.status(200).json(payment);
    } catch (err) {
      res.status(500).json(err);
    }
  });


  module.exports = router;