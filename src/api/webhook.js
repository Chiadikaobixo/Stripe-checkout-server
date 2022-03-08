const StripeAPI = require('../stripe')

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

    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object
            console.log('Event data', session)
    }
}

module.exports = webhook