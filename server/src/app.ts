import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import helmet from 'helmet'
import { errorHandler } from './middleware/errorHandler.middleware'
import routes from './routes'
import { rateLimiter } from './middleware/rateLimiter.middleware'

const app = express()

app.set('trust proxy', 1)

app.use(helmet())
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))

app.use(cookieParser())

app.use('/api', rateLimiter)
app.use(express.json({ limit: '10kb' }))
app.use(express.urlencoded({ extended: true, limit: '10kb' }))

app.use('/api', routes)

app.use(errorHandler)

export default app