import express from 'express'
import dotenv from 'dotenv'
import connectDB from './lib/db.js'
import authRoutes from './routes/auth.route.js'
import cookieParser from 'cookie-parser'

dotenv.config({})

const PORT=process.env.PORT || 5000
const app=express()
connectDB()

app.use(express.json())
app.use(cookieParser())
app.use("/api/auth",authRoutes);

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})

