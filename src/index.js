const express= require ('express')
const cors = require ('cors')
require('dotenv').config({ path: './.env' })
const createCheckoutSession = require ('./api/checkout')
const webhook = require('./api/webhook')
const decodeJWT = require('./auth/decodeJWT')
const setupIntent = require('./api/setupIntent')
const validateUser = require('./auth/validateUser')
const getCards = require('./api/getPaymentMethod')
const thePaymentIntent = require('./api/paymentIntent')
const updatePaymentIntent = require('./api/updatePaymentIntent')
const bodyParser = require("body-parser")


const app = express()
const port = 8080


app.use(express.json({
    verify: (req, res, buffer) => req['rawBody'] = buffer
}))

app.use(bodyParser.urlencoded({ extended: true }))

app.use((_req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    next()
})

app.use(cors())
app.use(decodeJWT)
app.post('/create-checkout-session', createCheckoutSession)
app.post('/webhook', webhook)
app.post('/create-payment-intent', thePaymentIntent)
app.post('/save-payment-method', validateUser, setupIntent)
app.get('/get-payment-method', validateUser, getCards)
app.put('/update-payment-intent', validateUser, updatePaymentIntent)

app.listen(port, () => console.log('server is listening on port', port))