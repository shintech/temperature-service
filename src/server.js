import express from 'express'
import bodyParser from 'body-parser'
import path from 'path'
import http from 'http'
import logger from 'winston'
import chalk from 'chalk'
import getRouter from './router'
import io from 'socket.io-client'
import fs from 'fs'

const _pkg = require(path.join(path.dirname(__dirname), 'package.json'))

const app = express()
const server = http.Server(app)

const socket = io('http://dev.shintech.ninja:8000')

const port = process.env['PORT']

const router = getRouter({
  logger: logger,
  socket: socket
})

let temp

const  file = '/sys/bus/w1/devices/28-8000002a46a6/w1_slave'

setInterval(() => {
  fs.readFile(file, 'utf8', (err, data) => {
    let output = data.split('=')
    let temptemp = output[output.length - 1].trim()
    
    if (!temp || temptemp !== temp) {
      let celcius = temptemp * 0.001
      let fahrenhiet = (celcius * 1.8)  + 32
      
      logger.info(`Emitting change in temp ${temp} -> ${temptemp}`)
      
      socket.emit('temp', {
        celcius: celcius,
        fahrenhiet: fahrenhiet
      })
      
      temp = temptemp
    }
  })
}, 10000)

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use('/api', router)

server.on('request', (req, res) => {
  logger.info(req.method, req.url)
})

server.on('listening', () => {
  logger.info(`${chalk.bgBlack.cyan(_pkg.name)} version ${chalk.bgBlack.yellow(_pkg.version)} is listening on port ${chalk.bgBlack.green(port)}...`)
})

server.listen(port)