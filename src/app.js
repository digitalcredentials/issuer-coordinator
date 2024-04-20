import express from 'express'
import cors from 'cors'
import axios from 'axios'
import accessLogger from './middleware/accessLogger.js'
import errorHandler from './middleware/errorHandler.js'
import errorLogger from './middleware/errorLogger.js'
import invalidPathHandler from './middleware/invalidPathHandler.js'
import verifyAuthHeader from './verifyAuthHeader.js'
import { getConfig } from './config.js'

class IssuingException extends Error {
  constructor(code, message, error = null) {
    super(message)
    this.code = code
    this.error = error
    this.message = message
  }
}

async function callService (endpoint, body) {
  const { data } = await axios.post(endpoint, body)
  return data
}

export async function build (opts = {}) {
  const {
    enableStatusService,
    statusService,
    signingService
  } = getConfig()

  const app = express()
  // Add the middleware to write access logs
  app.use(accessLogger())
  app.use(express.json())
  app.use(express.urlencoded({ extended: false }))
  app.use(cors())

  app.get('/', async function (req, res, next) {
    if (enableStatusService) {
      try {
        await axios.get(`http://${statusService}/`)
      } catch (e) {
        next({
          message: 'status service is NOT running.',
          error: e,
          code: 500
        })
      }
    }
    try {
      await axios.get(`http://${signingService}/`)
    } catch (e) {
      next({
        message: 'signing service is NOT running.',
        error: e,
        code: 500
      })
    }

    const message = enableStatusService
      ? 'issuer-coordinator, status-service, and signing-service all ok.'
      : 'issuer issuer-coordinator and signing-service both ok. status-service is disabled.'

    res.status(200).send({ message })
  })

  app.get('/seedgen', async (req, res, next) => {
    const response = await axios.get(`http://${signingService}/seedgen`)
    return res.json(response.data)
  })

  app.get('/did-key-generator', async (req, res, next) => {
    const response = await axios.get(`http://${signingServiceEndpoint}/did-key-generator`)
    return res.json(response.data)
  })

  app.post('/did-web-generator', async (req, res, next) => {
    const body = req.body
    const response = await axios.post(`http://${signingServiceEndpoint}/did-web-generator`, body)
    return res.json(response.data)
  })
  app.post('/instance/:tenantName/credentials/issue',
    async (req, res, next) => {
      try {
        const tenantName = req.params.tenantName // the issuer instance/tenant with which to sign
        const authHeader = req.headers.authorization
        const unSignedVC = req.body

        await verifyAuthHeader(authHeader, tenantName)
        // NOTE: we throw the error here which will then be caught by middleware errorhandler
        if (!unSignedVC || !Object.keys(unSignedVC).length) throw new IssuingException(400, 'A verifiable credential must be provided in the body')
        const vcWithStatus = enableStatusService
          ? await callService(`http://${statusService}/credentials/status/allocate`, unSignedVC)
          : unSignedVC
        const signedVC = await callService(`http://${signingService}/instance/${tenantName}/credentials/sign`, vcWithStatus)
        return res.json(signedVC)
      } catch (error) {
        // have to catch async errors and forward error handling
        // middleware
        next(error)
      }
    })

  // updates the status
  // the body will look like:  {credentialId: '23kdr', credentialStatus: [{type: 'BitstringStatusListCredential', status: 'revoked'}]}
  app.post('/instance/:tenantName/credentials/status',
    async (req, res, next) => {
      if (!enableStatusService) return res.status(405).send('The status service has not been enabled.')
      try {
        const tenantName = req.params.tenantName // the issuer instance/tenant with which to sign
        const authHeader = req.headers.authorization
        const statusUpdate = req.body
        await verifyAuthHeader(authHeader, tenantName)
        // NOTE: we throw the error here which will then be caught by middleware errorhandler
        if (!statusUpdate || !Object.keys(statusUpdate).length) throw new IssuingException(400, 'A status update must be provided in the body.')
        const updateResult = await callService(`http://${statusService}/credentials/status`, statusUpdate)
        return res.json(updateResult)
      } catch (error) {
        if (error.response?.status === 404) {
          // if it is a 404 then just forward on the error
          // we got from the service
          next(error.response.data)
        }
        // otherwise, forward the error to middleware:
        next(error)
      }
    })

  // Attach the error handling middleware calls, in order they should run
  app.use(errorLogger)
  app.use(errorHandler)
  app.use(invalidPathHandler)

  return app
}
