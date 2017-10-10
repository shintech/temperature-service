import express from 'express'
import bodyParser from 'body-parser'
import path from 'path'
import http from 'http'
import logger from 'winston'
import execa from 'execa'
import chalk from 'chalk'
import getRouter from './router'
import init from './db'
import config from './config'

const _pkg = require(path.join(path.dirname(__dirname), 'package.json'))

const app = express()
const server = http.Server(app)

const port = process.env['PORT']
const environment = process.env['NODE_ENV']

const db = init({
  logger: logger,
  environment: environment,
  config: config
})

const router = getRouter({
  logger: logger,
  db: db
})

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(router)

server.on('request', (req, res) => {
  logger.info(req.method, req.url)
})

server.on('listening', () => {
  logger.info(`${chalk.bgBlack.cyan(_pkg.name)} version ${chalk.bgBlack.yellow(_pkg.version)} is listening on port ${chalk.bgBlack.green(port)}...`)
})

const cmd = 'sudo modprobe w1-gpio && sudo modprobe w1-therm'

execa.shell(cmd)
.then(() => {
  server.listen(port)
})
