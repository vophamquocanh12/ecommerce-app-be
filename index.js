const express = require("express")
const cors = require("cors")
const mongoose = require('mongoose')
const app = express()

const bodyParser = require("body-parser")
const morgan = require("morgan")
const dotenv = require("dotenv")


dotenv.config()

// config routes
const categoryRouter = require('./routes/category')
const trademarkRouter = require('./routes/trademark')
const productRouter = require('./routes/product')
const productDetailRouter = require('./routes/productDetail')
const sizeRouter = require('./routes/size')
const billDetailRouter = require('./routes/billDetail')
const billRouter = require('./routes/bill')
const userRouter = require('./routes/user')

mongoose.set('strictQuery', false);
// connect database
mongoose.connect(process.env.MONGODB_URL, () => {
    console.log("===> Connected to MongoDB <===");
});


app.use(bodyParser.json({limit: "50mb"}))
app.use(cors())
app.use(morgan("common"))
// morgan 200 is success


app.use('/api/categories', categoryRouter)
app.use('/api/trademarks', trademarkRouter)
app.use('/api/products', productRouter)
app.use('/api/product-details', productDetailRouter)
app.use('/api/sizes', sizeRouter)
app.use('/api/bill-details', billDetailRouter)
app.use('/api/bills', billRouter)
app.use('/api/users', userRouter)

app.listen(5000, () => {
    console.log("Server is running... ");
} )