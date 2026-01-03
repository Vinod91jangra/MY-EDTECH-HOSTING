const Razorpay = require("razorpay");

let instance = null;

function getInstance(){
    if(instance) return instance;

    const key = process.env.RAZORPAY_KEY;
    const secret = process.env.RAZORPAY_SECRET;

    if(!key || !secret){
        console.warn("Razorpay credentials missing (RAZORPAY_KEY, RAZORPAY_SECRET). Razorpay not initialized.");
        return null;
    }

    instance = new Razorpay({
        key_id: key,
        key_secret: secret,
    });

    return instance;
}

module.exports = { getInstance };
