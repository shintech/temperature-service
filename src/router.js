import express from 'express'
import {temperature} from './queries'

const router = express.Router()

export default function getRouter (options) {
  router.route('/temperature')
  .get(temperature(options).getTemp)

  return router
}
