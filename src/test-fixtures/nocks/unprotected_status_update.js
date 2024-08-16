import nock from 'nock'

export default () => {
  nock('http://localhost:4008', { encodedQueryParams: true })
    .post('/credentials/status', {
      credentialId: 'urn:uuid:951b475e-b795-43bc-ba8f-a2d01efd2eb1',
      credentialStatus: [{ type: 'BitstringStatusListCredential', status: 'revoked' }]
    })
    .reply(200, 'Credential status successfully updated', [
      'X-Powered-By',
      'Express',
      'Access-Control-Allow-Origin',
      '*',
      'Content-Type',
      'text/html; charset=utf-8',
      'Content-Length',
      '38',
      'ETag',
      'W/"26-5PplkKqVB9H6fTLVTOo/weOUkgE"',
      'Date',
      'Wed, 23 Aug 2023 13:01:55 GMT',
      'Connection',
      'keep-alive',
      'Keep-Alive',
      'timeout=5'
    ])
}
