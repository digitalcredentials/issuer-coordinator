import express from 'express';
import cors from 'cors';
import axios from 'axios';
import accessLogger from './middleware/accessLogger.js';
import errorHandler from './middleware/errorHandler.js';
import errorLogger from './middleware/errorLogger.js';
import invalidPathHandler from './middleware/invalidPathHandler.js';
import verifyAuthHeader from './verifyAuthHeader.js'
import {getConfig} from './config.js'

async function callService(endpoint, body) {
        const { data } = await axios.post(endpoint, body);
        return data  
}

export async function build(opts = {}) {

    const {enableStatusService, statusServiceEndpoint, signingServiceEndpoint} = getConfig();
    var app = express();
    // Add the middleware to write access logs
    app.use(accessLogger());
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cors())

    app.get('/', async function (req, res, next) {
        if (enableStatusService) {
            try {
                await axios.get(`http://${statusServiceEndpoint}/`)
            } catch (e) {
            next({   
                    message: 'status service is NOT running.', 
                    error: e,
                    code: 500
                })
            }
        }
        try {
            await axios.get(`http://${signingServiceEndpoint}/`)  
        } catch (e) {
            next({   
                    message: 'signing service is NOT running.', 
                    error: e,
                    code: 500
                })
            }

        const message = enableStatusService ? 
            "issuer-coordinator, status-service, and signing-service all ok."
            :
            "issuer issuer-coordinator and signing-service both ok. status-service is disabled."

        res.status(200).send({ message })
      
    });

    app.get('/seedgen', async (req, res, next) => {
        const response = await axios.get(`http://${signingServiceEndpoint}/seedgen`)
        return res.json(response.data)
    });

    app.post("/instance/:tenantName/credentials/issue",
        async (req, res, next) => {
            try {
                const tenantName = req.params.tenantName //the issuer instance/tenant with which to sign
                const authHeader = req.headers.authorization
                const unSignedVC = req.body;

                await verifyAuthHeader(authHeader, tenantName)
                // NOTE: we throw the error here which will then be caught by middleware errorhandler
                if (!req.body || !Object.keys(req.body).length) throw {code:400, message:'A verifiable credential must be provided in the body'}
                const vcWithStatus = enableStatusService ?
                    await callService(`http://${statusServiceEndpoint}/credentials/status/allocate`, unSignedVC)
                    :
                    unSignedVC
                const signedVC = await callService(`http://${signingServiceEndpoint}/instance/${tenantName}/credentials/sign`, vcWithStatus)
                return res.json(signedVC)

            } catch (error) {
                // have to catch async errors and forward error handling
                // middleware
                next(error)
            }
        })

    // updates the status
    // the body will look like:  {credentialId: '23kdr', credentialStatus: [{type: 'StatusList2021Credential', status: 'revoked'}]}
    app.post("/instance/:tenantName/credentials/status",
        async (req, res, next) => {
            if (!enableStatusService) return res.status(405).send("The status service has not been enabled.")  
            try {
                const tenantName = req.params.tenantName //the issuer instance/tenant with which to sign
                const authHeader = req.headers.authorization
                const statusUpdate = req.body
                await verifyAuthHeader(authHeader, tenantName)
                const updateResult = await callService(`http://${statusServiceEndpoint}/credentials/status`, statusUpdate)
                return res.json(updateResult)
            } catch (error) {
                // have to catch and forward async errors to middleware:
                next(error)
            }
        })

    // Attach the error handling middleware calls, in order they should run
    app.use(errorLogger)
    app.use(errorHandler)
    app.use(invalidPathHandler)

    return app;

}
