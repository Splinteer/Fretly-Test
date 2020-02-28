const express = require('express')
const app = express()
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const port = 8080
const config = require('./config')
const userRoute = require('./lib/user/userRoute')

//db connection
mongoose.connect(config.dbHost, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.text())
app.use(bodyParser.json({ type: 'application/json'}))

app.use(cookieParser())
app.use(session({
  secret: 'FletlyTE$T',
  resave: false,
  saveUninitialized: true
}))

userRoute(app)

app.use(function (req, res) {
  res.status(404).send({
    error: req.originalUrl + ' not found'
  })
})

app.listen(port)
console.log('Server started on: ' + port)

module.exports = app // for testing
