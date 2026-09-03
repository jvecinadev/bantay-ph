import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { errorHandler } from './middleware/errorHandler.middleware'

const app = express()

app.use(express.json())
app.set("trust proxy", 1)
app.use(cors({
        origin: 'http://localhost:5173',
        credentials: true
}))
app.use(cookieParser())


app.use(errorHandler)

export default app;