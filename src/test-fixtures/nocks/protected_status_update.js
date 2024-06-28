import nock from 'nock'

export default () => {
  nock('http://localhost:4008', { encodedQueryParams: true })
    .post('/credentials/status', {
      credentialId: 'urn:uuid:951b475e-b795-43bc-ba8f-a2d01efd2eb1',
      credentialStatus: [{ type: 'BitstringStatusListCredential', status: 'revoked' }]
    })
    .reply(200, { code: 200, message: 'Credential status successfully updated.' }, [
      'X-Powered-By',
      'Express',
      'Access-Control-Allow-Origin',
      '*',
      'Content-Type',
      'application/json; charset=utf-8',
      'Content-Length',
      '64',
      'ETag',
      'W/"40-QIRY/d4PUONYie1grSHLdg5/hcs"',
      'Date',
      'Wed, 23 Aug 2023 20:42:41 GMT',
      'Connection',
      'keep-alive',
      'Keep-Alive',
      'timeout=5'
    ])
}
