import nock from 'nock'

export default () => {
  nock('http://localhost:4008', { encodedQueryParams: true })
    .post('/credentials/status', {
      credentialId: 'kj09ij',
      credentialStatus: [{ type: 'BitstringStatusListCredential', status: 'revoked' }]
    })
    .reply(404, { code: 404, message: 'Credential ID not found.' }, [
      'X-Powered-By',
      'Express',
      'Access-Control-Allow-Origin',
      '*',
      'Content-Type',
      'application/json; charset=utf-8',
      'Content-Length',
      '49',
      'ETag',
      'W/"31-lbV74I+iXZStkOsz/GAY1mIZewQ"',
      'Date',
      'Wed, 23 Aug 2023 20:44:24 GMT',
      'Connection',
      'keep-alive',
      'Keep-Alive',
      'timeout=5'
    ])
}
