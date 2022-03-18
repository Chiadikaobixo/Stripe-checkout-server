const StripeAPI = require('../stripe')

const webhookHandlers = {
    'checkout.session.completed': (data) => {
        console.log('Checkout Completed Successfully', data)
    },

    'payment_intent.succeeded': (data) => {
        console.log('Payment Succeeded', data)
    },

    'payment_intent.payment_failed': (data) => {
        console.log('Payment Failed', data)
    }
}

const webhook = (req, res) => {
    const sig = req.headers['stripe-signature']

    let event

    try {
        event = StripeAPI.webhooks.constructEvent(
            req['rawBody'], sig, process.env.WEB_HOOK_SECRET);
    }
    catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if(webhookHandlers[event.type]){
        webhookHandlers[event.type](event.data.object)
    }
}

module.exports = webhook