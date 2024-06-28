import nock from 'nock'
import { expect } from 'chai'
import request from 'supertest'
import { getUnsignedVC } from './test-fixtures/vc.js'
import unprotectedNock from './test-fixtures/nocks/unprotected_status_signing.js'
import protectedNock from './test-fixtures/nocks/protected_status_signing.js'
import unprotectedStatusUpdateNock from './test-fixtures/nocks/unprotected_status_update.js'
import unknownStatusIdNock from './test-fixtures/nocks/unknown_status_id_nock.js'
import protectedStatusUpdateNock from './test-fixtures/nocks/protected_status_update.js'

import { build } from './app.js'

let testTenantToken
let testTenantToken2

let statusUpdateBody
let app

describe('api', () => {
  before(async () => {
    testTenantToken = process.env.TENANT_TOKEN_PROTECTED_TEST
    testTenantToken2 = process.env.TENANT_TOKEN_PROTECTED_TEST_2
    statusUpdateBody = {
      credentialId: 'urn:uuid:951b475e-b795-43bc-ba8f-a2d01efd2eb1',
      credentialStatus: [{ type: 'BitstringStatusListCredential', status: 'revoked' }]
    }
  })

  after(() => {
  })

  beforeEach(async () => {
    app = await build()
    if (!nock.isActive()) nock.activate()
  })

  afterEach(async () => {
    nock.restore()
  })

  describe('GET /', () => {
    it('GET / => hello', done => {
      nock('http://localhost:4006').get('/').reply(200, 'signing-service server status: ok.')
      nock('http://localhost:4008').get('/').reply(200, 'status-service server status: ok.')

      request(app)
        .get('/')
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(/{"message":"issuer-coordinator, status-service, and signing-service all ok."}/, done)
    })
  })

  describe('GET /unknown', () => {
    it('unknown endpoint returns 404', done => {
      request(app)
        .get('/unknown')
        .expect(404, done)
    }, 10000)
  })

  describe('POST /instance/:instanceId/credentials/issue', () => {
    it('returns 400 if no body', done => {
      request(app)
        .post('/instance/protected_test/credentials/issue')
        .set('Authorization', `Bearer ${testTenantToken}`)
        .expect('Content-Type', /json/)
        .expect(400, done)
    })

    it('returns 401 if tenant token is missing from auth header', done => {
      request(app)
        .post('/instance/protected_test/credentials/issue')
        .send(getUnsignedVC())
        .expect('Content-Type', /json/)
        .expect(401, done)
    })

    it('issues credential for unprotected tenant', async () => {
      unprotectedNock()

      const response = await request(app)
        .post('/instance/un_protected_test/credentials/issue')
        .send(getUnsignedVC())

      expect(response.header['content-type']).to.have.string('json')
      expect(response.status).to.equal(200)
      expect(response.body)
    })

    it('returns 403 if token is not valid', done => {
      request(app)
        .post('/instance/protected_test/credentials/issue')
        .set('Authorization', 'Bearer badToken')
        .send(getUnsignedVC())
        .expect('Content-Type', /json/)
        .expect(403, done)
    })

    it('returns 403 when trying to use token for a different tenant', done => {
      request(app)
        .post('/instance/protected_test/credentials/issue')
        .set('Authorization', `Bearer ${testTenantToken2}`)
        .send(getUnsignedVC())
        .expect('Content-Type', /json/)
        .expect(403, done)
    })

    it('returns 401 if token is not marked as Bearer', done => {
      request(app)
        .post('/instance/protected_test/credentials/issue')
        .set('Authorization', `${testTenantToken}`)
        .send(getUnsignedVC())
        .expect('Content-Type', /json/)
        .expect(401, done)
    })

    it('returns 404 if no seed for tenant name', done => {
      request(app)
        .post('/instance/wrongTenantName/credentials/issue')
        .set('Authorization', `${testTenantToken}`)
        .send(getUnsignedVC())
        .expect(404, done)
        .expect('Content-Type', /json/)
    })

    it('returns signed vc for protected tenant', async () => {
      protectedNock()
      const sentCred = getUnsignedVC()
      const response = await request(app)
        .post('/instance/protected_test/credentials/issue')
        .set('Authorization', `Bearer ${testTenantToken}`)
        .send(sentCred)

      expect(response.header['content-type']).to.have.string('json')
      expect(response.status).to.equal(200)

      const returnedCred = JSON.parse(JSON.stringify(response.body))
      // this proof value comes from the nock:
      expect(returnedCred.proof.proofValue).to.equal('z5QQ12zr5JvEsKvbnEN2EYZ6punR6Pa5wMJzywGJ2dCh6SSA5oQb9hBiGADsNTbs57bopArwdBHE9kEVemMxcu1Fq')
    })
  })

  describe('POST /instance/:instanceId/credentials/status', () => {
    it('returns 400 if no body', done => {
      request(app)
        .post('/instance/un_protected_test/credentials/status')
        .set('Authorization', `Bearer ${testTenantToken}`)
        .expect('Content-Type', /json/)
        .expect(400, done)
    })

    it('returns 401 if tenant token is missing from auth header', done => {
      request(app)
        .post('/instance/protected_test/credentials/status')
        .send(statusUpdateBody)
        .expect('Content-Type', /json/)
        .expect(401, done)
    })

    it('update unprotected status when token not set for tenant in config', done => {
      unprotectedStatusUpdateNock()
      request(app)
        .post('/instance/un_protected_test/credentials/status')
        .send(statusUpdateBody)
        .expect('Content-Type', /json/)
        .expect(200, done)
    })

    it('returns 403 if token is not valid', done => {
      request(app)
        .post('/instance/protected_test/credentials/status')
        .set('Authorization', 'Bearer ThisIsABadToken')
        .send(statusUpdateBody)
        .expect('Content-Type', /json/)
        .expect(403, done)
    })

    it('returns 401 if token is not marked as Bearer', done => {
      request(app)
        .post('/instance/protected_test/credentials/status')
        .set('Authorization', `${testTenantToken}`)
        .send(statusUpdateBody)
        .expect('Content-Type', /json/)
        .expect(401, done)
    })

    it('returns 404 if no seed for tenant name', done => {
      request(app)
        .post('/instance/wrongTenantName/credentials/status')
        .set('Authorization', `${testTenantToken}`)
        .send(statusUpdateBody)
        .expect(404, done)
        .expect('Content-Type', /json/)
    })

    it('returns 403 when trying to use token for a different tenant', done => {
      request(app)
        .post('/instance/protected_test/credentials/status')
        .set('Authorization', `Bearer ${testTenantToken2}`)
        .send(statusUpdateBody)
        .expect('Content-Type', /json/)
        .expect(403, done)
    })

    it('returns 404 for unknown cred id', async () => {
      unknownStatusIdNock()
      const statusUpdateBodyWithUnknownId = JSON.parse(JSON.stringify(statusUpdateBody))
      statusUpdateBodyWithUnknownId.credentialId = 'kj09ij'
      const response = await request(app)
        .post('/instance/protected_test/credentials/status')
        .set('Authorization', `Bearer ${testTenantToken}`)
        .send(statusUpdateBodyWithUnknownId)

      expect(response.header['content-type']).to.have.string('json')
      expect(response.status).to.equal(404)
    })

    it('calls status manager for protected tenant', async () => {
      protectedStatusUpdateNock()
      const response = await request(app)
        .post('/instance/protected_test/credentials/status')
        .set('Authorization', `Bearer ${testTenantToken}`)
        .send(statusUpdateBody)

      expect(response.header['content-type']).to.have.string('json')
      expect(response.status).to.equal(200)
    })
  })
})
