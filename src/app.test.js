import nock from 'nock';
import axios from 'axios'
import { expect } from 'chai'
import { dirname } from 'path';
import request from 'supertest';
import { fileURLToPath } from 'url';
import { getUnsignedVC, getUnsignedVCWithStatus } from './test-fixtures/vc.js';
import unsignedNock from './test-fixtures/nocks/unprotected_sign.js'


axios.defaults.adapter = 'http'
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
nock.back.fixtures = __dirname + '/nockBackFixtures'
let saveNockRecording;



async function startNockBackRecording(fixtureFileName) {
  nock.back.setMode('wild')
  const { nockDone } = await nock.back('nockMocks.json');
  saveNockRecording = nockDone
  // allow the requests to localhost, i.e, the test calls themselves
  //nock.enableNetConnect(/127\.0\.0\.1/);
  //nock.enableNetConnect(/localhost/);
}

async function stopAndSaveNockRecording() {
  saveNockRecording()
  //nock.back.setMode('wild')
}

import { build } from './app.js';

let testTenantToken
let testTenantToken2

let statusUpdateBody
let app

describe('api', () => {

  before(async () => {
    //testDIDSeed = await decodeSeed(process.env.TENANT_SEED_TESTING)
    testTenantToken = process.env.TENANT_TOKEN_TESTING
    testTenantToken2 = process.env.TENANT_TOKEN_TESTING_2

    //didDocument = (await didKeyDriver.generate({ seed: testDIDSeed })).didDocument
    //verificationMethod = didKeyDriver.publicMethodFor({ didDocument, purpose: 'assertionMethod' }).id
    //signingDID = didDocument.id
    statusUpdateBody = { "credentialId": "urn:uuid:951b475e-b795-43bc-ba8f-a2d01efd2eb1", "credentialStatus": [{ "type": "StatusList2021Credential", "status": "revoked" }] }

    //startNockBackRecording()
  });

  after(() => {
    //stopAndSaveNockRecording()
  })

  beforeEach(async () => {
    app = await build();

  });

  afterEach(async () => {
    nock.restore()
  });

  describe('GET /', () => {
    it('GET / => hello', done => {

      nock('http://localhost:4006').get("/").reply(200, 'signing-service server status: ok.')
      nock('http://localhost:4008').get("/").reply(200, 'signing-service server status: ok.')

      request(app)
        .get("/")
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(/{"message":"issuer-coordinator, status-service, and signing-service all ok."}/, done);

    });
  })

  describe('GET /unknown', () => {
    it('unknown endpoint returns 404', done => {
      request(app)
        .get("/unknown")
        .expect(404, done)
    }, 10000);
  })

  describe('POST /instance/:instanceId/credentials/issue', () => {

    it('returns 400 if no body', done => {
      request(app)
        .post("/instance/testing/credentials/issue")
        .set('Authorization', `Bearer ${testTenantToken}`)
        .expect('Content-Type', /json/)
        .expect(400, done)
    })

    it('returns 401 if tenant token is missing from auth header', done => {
      request(app)
        .post("/instance/testing/credentials/issue")
        .send(getUnsignedVC())
        .expect('Content-Type', /json/)
        .expect(401, done)
    })

    it.only('issues credential for UNPROTECTED tenant, without auth header', async () => {
      //nock.recorder.rec()
      unsignedNock();

      const response = await request(app)
        .post("/instance/testing3/credentials/issue")
        .send(getUnsignedVC())

      expect(response.header["content-type"]).to.have.string("json");
      expect(response.status).to.eql(200);
      expect(response.body)

      
    })

    it('returns 403 if token is not valid', done => {
      request(app)
        .post("/instance/testing/credentials/issue")
        .set('Authorization', `Bearer badToken`)
        .send(getUnsignedVC())
        .expect('Content-Type', /text/)
        .expect(403, done)
    })

    it('returns 403 when trying to use token for a different tenant', done => {
      request(app)
        .post("/instance/testing/credentials/issue")
        .set('Authorization', `Bearer ${testTenantToken2}`)
        .send(getUnsignedVC())
        .expect('Content-Type', /text/)
        .expect(403, done)
    })

    it('returns 401 if token is not marked as Bearer', done => {
      request(app)
        .post("/instance/testing/credentials/issue")
        .set('Authorization', `${testTenantToken}`)
        .send(getUnsignedVC())
        .expect('Content-Type', /text/)
        .expect(401, done)
    })

    it('returns 404 if no seed for tenant name', done => {
      request(app)
        .post("/instance/wrongTenantName/credentials/issue")
        .set('Authorization', `${testTenantToken}`)
        .send(getUnsignedVC())
        .expect(404, done)
        .expect('Content-Type', /text/)

    })

    it('invokes the signing service', async () => {})

    it('invokes the status service', async () => {})


    it('returns the vc from signing service', async () => {
      // get the returned VC from the nock, once we've run nock-back.
      const credFromSigningService = "will get from  nock."
      const sentCred = getUnsignedVCWithStatus()
      const response = await request(app)
        .post("/instance/testing/credentials/issue")
        .set('Authorization', `Bearer ${testTenantToken}`)
        .send(sentCred)

      expect(response.header["content-type"]).to.have.string("json");
      expect(response.status).to.eql(200);

      const returnedCred = JSON.parse(JSON.stringify(response.body));
      expect(credFromSigningService).to.eql(returnedCred)

    });

  })

  describe('POST /instance/:instanceId/credentials/status', () => {

    it('returns 400 if no body', done => {
      request(app)
        .post("/instance/testing/credentials/status")
        .set('Authorization', `Bearer ${testTenantToken}`)
        .expect('Content-Type', /text/)
        .expect(400, done)
    })

    it('returns 401 if tenant token is missing from auth header', done => {
      request(app)
        .post("/instance/testing/credentials/status")
        .send(statusUpdateBody)
        .expect('Content-Type', /text/)
        .expect(401, done)
    })

    it('no auth header needed to update status when token not set for tenant in config', done => {
      request(app)
        .post("/instance/testing3/credentials/status")
        .send(statusUpdateBody)
        .expect('Content-Type', /text/)
        .expect(200, done)
    })

    it('returns 403 if token is not valid', done => {
      request(app)
        .post("/instance/testing/credentials/status")
        .set('Authorization', `Bearer ThisIsABadToken`)
        .send(statusUpdateBody)
        .expect('Content-Type', /text/)
        .expect(403, done)
    })

    it('returns 401 if token is not marked as Bearer', done => {
      request(app)
        .post("/instance/testing/credentials/status")
        .set('Authorization', `${testTenantToken}`)
        .send(statusUpdateBody)
        .expect('Content-Type', /text/)
        .expect(401, done)
    })

    it('returns 404 if no seed for tenant name', done => {
      request(app)
        .post("/instance/wrongTenantName/credentials/status")
        .set('Authorization', `${testTenantToken}`)
        .send(statusUpdateBody)
        .expect(404, done)
        .expect('Content-Type', /text/)

    })

    it('returns 403 when trying to use token for a different tenant', done => {
      request(app)
        .post("/instance/testing/credentials/status")
        .set('Authorization', `Bearer ${testTenantToken2}`)
        .send(statusUpdateBody)
        .expect('Content-Type', /text/)
        .expect(403, done)
    })

    it('returns 404 for unknown cred id', done => {
      // it wil have gotten the 404 from the status service and then
      // simply returned that.
      const statusUpdateBodyWithUnknownId = JSON.parse(JSON.stringify(statusUpdateBody))
      statusUpdateBodyWithUnknownId.credentialId = 'kj09ij'
      request(app)
        .post("/instance/testing/credentials/status")
        .set('Authorization', `Bearer ${testTenantToken}`)
        .send(statusUpdateBodyWithUnknownId)
        .expect('Content-Type', /text/)
        .expect(404, done)
    })
    // AND A TEST FOR THE GENERAL BAD REQUEST THAT DOESN'T FALL INTO THE OTHER CATEGORIES.

    it('calls status manager', async () => {
      const response = await request(app)
        .post("/instance/testing/credentials/status")
        .set('Authorization', `Bearer ${testTenantToken}`)
        .send(statusUpdateBody)

      expect(response.header["content-type"]).to.have.string("text");
      expect(response.status).to.eql(200);
    })

  })
})


