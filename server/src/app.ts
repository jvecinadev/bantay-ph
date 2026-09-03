import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'

const app = express()

app.use(express.json())
app.use(cors({
        origin: 'http://localhost:5173',
        credentials: true
}))
app.use(cookieParser())
app.set("trust proxy", 1)

export default app;