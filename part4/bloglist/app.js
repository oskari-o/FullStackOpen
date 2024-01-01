const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const config = require('./utils/config')
const middleware = require('./utils/middleware')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const e = require('express')

const jwt = require('jsonwebtoken')
const User = require('./models/user')

// const logger = require('./utils/logger')

// const requestLogger = (request, response, next) => {
//   logger.info('Method:', request.method)
//   logger.info('Path:  ', request.path)
//   logger.info('Body:  ', request.body)
//   logger.info('---')
//   next()
// }

// const tokenExtractor = (request, response, next) => {
//   const authorization = request.get('Authorization')
//   if (authorization && authorization.startsWith('bearer ')) {
//     request.token = authorization.replace('bearer ', '')
//     logger.info(`Token extracted: ${request.token}`)
//   } else {
//     request.token = null
//   }
//   next()
// }

// const userExtractor = async (request, response, next) => {
//   const decodedToken = jwt.verify(request.token, process.env.SECRET)
//   if (!decodedToken.id) {
//     return response.status(401).json({ error: 'token invalid' })
//   }
//   const user = await User.findById(decodedToken.id)
//   request.user = user
//   next()
// }

const mongoUrl = config.MONGODB_URI
mongoose.connect(mongoUrl)

app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)

app.use("/api/blogs", blogsRouter)
app.use("/api/users", usersRouter)
app.use("/api/login", loginRouter)

// const errorHandler = (error, request, response, next) => {
//   logger.error(error.message)

//   if (error.name === 'ValidationError') {
//     return response.status(400).json({ error: error.message })
//   } else if (error.name === 'MongoServerError') {
//     return response.status(400).json({ error: error.message })
//   } else if (error.name ===  'JsonWebTokenError') {
//     return response.status(401).json({ error: error.message })
//   } else if (error.name === 'TokenExpiredError') {
//     return response.status(401).json({
//       error: 'token expired'
//     })
//   }
//   next(error)
// }

app.use(middleware.errorHandler)
app.use(middleware.unknownEndpoint)

module.exports = app