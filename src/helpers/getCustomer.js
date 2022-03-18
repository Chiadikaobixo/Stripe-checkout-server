const stripeAPI = require('../stripe')
const firebase = require ('../firebase')

const createCustomer = async(userId) => {
    const userSnapShot = await firebase.db.collection('users').doc(userId).get()

    const { email } = userSnapShot.data()

    const customer = await stripeAPI.customers.create({
        email,
        metadata: {
            firebaseUID: userId
        }
    })

    await userSnapShot.ref.update({ stripeCustomerId: customer.id})
    return customer
}

const getCustomer = async(userId) => {
    const userSnapShot = await firebase.db.collection('users').doc(userId).get()

    const { stripeCustomerId } = userSnapShot.data()

    if(!stripeCustomerId) {
        return createCustomer(userId)
    }

    customer = await stripeAPI.customers.retrieve(stripeCustomerId)

    return customer
}

module.exports = getCustomer