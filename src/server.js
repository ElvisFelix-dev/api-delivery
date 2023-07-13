import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'
import path from 'path'

import seedRouter from './routes/seedRoutes.js'
import productRouter from './routes/productRoutes.js'
import userRouter from './routes/userRoutes.js'
import orderRouter from './routes/orderRoutes.js'
import uploadRouter from './routes/uploadRoutes.js'

dotenv.config()

mongoose
  .connect(process.env.MONGODB_URI_ATLAS)
  .then(() => {
    console.log('📊 connected to db')
  })
  .catch((err) => {
    console.log(err.message)
  })

const app = express()

app.use(cors())

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/api/keys/paypal', (_req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID || 'sb')
})

app.get('/api/keys/google', (_req, res) => {
  res.send({ key: process.env.GOOGLE_API_KEY || '' })
})

const __dirname = path.resolve()
app.use(express.static(path.join(__dirname, '/frontend/build')))
app.get('*', (_req, res) =>
  res.sendFile(path.join(__dirname, '/frontend/build/index.html')),
)

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err, _req, res, _next) => {
  res.status(500).send({ message: err.message })
})

app.use('/api/upload', uploadRouter)
app.use('/api/seed', seedRouter)
app.use('/api/products', productRouter)
app.use('/api/users', userRouter)
app.use('/api/orders', orderRouter)

app.listen(3333, () => {
  console.log(`💻 server running`)
})
