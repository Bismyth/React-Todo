import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import path from 'path'
import passport from 'passport'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import bodyParser from 'body-parser'
import passportConfig from './passportConfig'
import conMongo from 'connect-mongo'

import auth from './routes/auth'
import test from './routes/test'

const app: express.Application = express()

//Initalise environment variables
const webRoot: string = path.join(
  __dirname,
  __dirname.split('/').pop() === 'build' ? '../../' : '../'
)
dotenv.config({
  path: path.join(webRoot, '.env')
})

//Connect to Database
mongoose
  .connect(process.env.MONGO_URI || 'missing URI', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.error(err))

//--------------------------------------------Middleware-----------------------------------------------
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(
  cors({
    origin: process.env.HOMEPAGE || 'http://localhost:3000',
    credentials: true
  })
)
const MongoStore = conMongo(session)
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      secret: process.env.SESSION_SECRET
    })
  })
)

app.use(cookieParser(process.env.SESSION_SECRET || 'secret'))

app.use(passport.initialize())
app.use(passport.session())
passportConfig(passport)
//----------------------------------------End of Middleware---------------------------------------------

//Routes
app.use('/api/auth', auth)
app.use('/api/test', test)

//Serve in Production
if (process.env.NODE_ENV == 'production') {
  console.log('Starting in Produciton mode.')
  app.use(express.static(path.join(webRoot, 'client/build')))
  app.use('/assets', express.static(path.join(webRoot, 'assets')))
  app.get('*', (req, res) => {
    res.sendFile(path.join(webRoot, 'client/build/index.html'))
  })
}

//Listen in on port and print what port
app.set('port', process.env.PORT || 5000)
app.listen(app.get('port'), () => {
  console.log(`Server started on port: ${app.get('port')}`)
})
