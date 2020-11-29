import express from 'express'
import path from 'path'
import dotenv from 'dotenv'

const app = express()

const webRoot = process.env.WEB_ROOT || path.join(__dirname, '../')
console.log(webRoot)

//Initalise environment variables
dotenv.config({
  path: path.join(webRoot, '.env')
})

//Body parser Middleware
app.use(express.json())

//Routes
app.get('/api/test', (req, res) => res.json({ msg: 'Test went good.' }))

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
