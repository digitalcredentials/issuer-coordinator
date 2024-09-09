import nock from 'nock'

export default () => {    

  nock('http://localhost:4006', {"encodedQueryParams":true})
  .post('/did-web-generator', {"url":"https://raw.githubusercontent.com/jchartrand/didWebTest/main"})
  .reply(200, {"seed":"z1AhHNg9RSiUrjKAeTLXeYjJG5xE4fyZsxfFwKkXM4PhPMn","decodedSeed":{"0":162,"1":121,"2":218,"3":124,"4":128,"5":83,"6":6,"7":120,"8":155,"9":52,"10":67,"11":214,"12":9,"13":96,"14":98,"15":108,"16":249,"17":187,"18":45,"19":240,"20":184,"21":177,"22":120,"23":176,"24":189,"25":125,"26":247,"27":38,"28":7,"29":64,"30":91,"31":77},"did":"did:web:raw.githubusercontent.com:jchartrand:didWebTest:main","didDocument":{"@context":["https://www.w3.org/ns/did/v1","https://w3id.org/security/suites/ed25519-2020/v1","https://w3id.org/security/suites/x25519-2020/v1"],"id":"did:web:raw.githubusercontent.com:jchartrand:didWebTest:main","assertionMethod":[{"id":"did:web:raw.githubusercontent.com:jchartrand:didWebTest:main#z6Mkoy5dFU7xajPV2QGEif1cz43To6go9Yhtf1T39TXCSMrS","type":"Ed25519VerificationKey2020","controller":"did:web:raw.githubusercontent.com:jchartrand:didWebTest:main","publicKeyMultibase":"z6Mkoy5dFU7xajPV2QGEif1cz43To6go9Yhtf1T39TXCSMrS"}]}}, [
  'X-Powered-By',
  'Express',
  'Access-Control-Allow-Origin',
  '*',
  'Content-Type',
  'application/json; charset=utf-8',
  'Content-Length',
  '957',
  'ETag',
  'W/"3bd-+yFc27zaIMTPRG+dm/pWiYDTumc"',
  'Date',
  'Mon, 09 Sep 2024 17:55:01 GMT',
  'Connection',
  'keep-alive',
  'Keep-Alive',
  'timeout=5'
]);
}
