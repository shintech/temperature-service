import execa from 'execa'
import fs from 'fs'

export default function (options) {
  const queries = {}

  queries.getTemp = (req, res) => {
    const  file = '/sys/bus/w1/devices/28-8000002a46a6/w1_slave'
    
    fs.readFile(file, 'utf8', (err, data) => {
      let output = data.split('=')
      let celcius = output[output.length - 1] * 0.001
      res.setHeader('Content-Type', 'application/json')
      
      res.send({ 
        Celcius: celcius,
        Fahrenhiet: (celcius * 1.8)  + 32 
      })
    })    
  }

  return queries
}
