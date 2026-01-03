const Razorpay = require("razorpay");



let instance = null;

if (process.env.RAZORPAY_KEY && process.env.RAZORPAY_SECRET) {
    instance = new Razorpay({
        key_id: process.env.RAZORPAY_KEY,
        key_secret: process.env.RAZORPAY_SECRET,
    });
} else {
    console.warn("Razorpay credentials missing (RAZORPAY_KEY, RAZORPAY_SECRET). Razorpay not initialized.");
}

exports.instance = instance;