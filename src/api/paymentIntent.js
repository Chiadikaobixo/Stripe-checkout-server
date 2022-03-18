const stripeAPI = require('../stripe')

const calculateOrderAmount = (cartItems) => {
    return cartItems.reduce((total, product) => {
        return total + product.price * product.quantity
    }, 0) * 100
}

const thePaymentIntent = async( req, res) => {
    const { cartItems, description, receipt_email, shipping} = req.body

    let paymentIntent
    try {
        paymentIntent = await stripeAPI.paymentIntents.create({
            amount: calculateOrderAmount(cartItems),
            currency: 'usd',
            description,
            payment_method_types: ['card'],
            receipt_email,
            shipping
        })

        res.status(200).json({ clientSecret: paymentIntent.client_secret, id: paymentIntent.id })
    } catch (error) {
        console.log(error)
        res.status(400).json({error: 'unable to create payment intent'})
    }
}

module.exports = thePaymentIntent