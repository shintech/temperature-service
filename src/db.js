import promise from 'bluebird'
import pg from 'pg-promise'
import chalk from 'chalk'

export default function (options) {
  const { environment, logger, config } = options

  const pgp = pg({
    promiseLib: promise
  })

  const connectionString = config.postgresURI[environment]
  const init = pgp(connectionString)
  const databaseName = connectionString.split('/')

  if (environment === 'development') {
    logger.info(`Connected to database: ${chalk.bgBlack.green(databaseName[databaseName.length - 1])}`)
  }

  return init
}
