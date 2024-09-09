import nock from 'nock'

export default () => {    

  nock('http://localhost:4006', {"encodedQueryParams":true})
  .get('/did-key-generator')
  .reply(200, {"seed":"z1Ak67saZZnW6e41kw8dFNgWPQC7kb4MgmKrB5Saj9fTQtR","decodedSeed":{"0":204,"1":42,"2":201,"3":165,"4":122,"5":6,"6":144,"7":61,"8":229,"9":222,"10":134,"11":94,"12":219,"13":6,"14":191,"15":210,"16":103,"17":71,"18":241,"19":109,"20":215,"21":216,"22":2,"23":72,"24":19,"25":144,"26":20,"27":32,"28":178,"29":172,"30":81,"31":82},"did":"did:key:z6Mkq5Vr5kEEUF6M8U7AgSKBVppXyNQBoWnyb1vMqedzN3ha","didDocument":{"@context":["https://www.w3.org/ns/did/v1","https://w3id.org/security/suites/ed25519-2020/v1","https://w3id.org/security/suites/x25519-2020/v1"],"id":"did:key:z6Mkq5Vr5kEEUF6M8U7AgSKBVppXyNQBoWnyb1vMqedzN3ha","verificationMethod":[{"id":"did:key:z6Mkq5Vr5kEEUF6M8U7AgSKBVppXyNQBoWnyb1vMqedzN3ha#z6Mkq5Vr5kEEUF6M8U7AgSKBVppXyNQBoWnyb1vMqedzN3ha","type":"Ed25519VerificationKey2020","controller":"did:key:z6Mkq5Vr5kEEUF6M8U7AgSKBVppXyNQBoWnyb1vMqedzN3ha","publicKeyMultibase":"z6Mkq5Vr5kEEUF6M8U7AgSKBVppXyNQBoWnyb1vMqedzN3ha"}],"authentication":["did:key:z6Mkq5Vr5kEEUF6M8U7AgSKBVppXyNQBoWnyb1vMqedzN3ha#z6Mkq5Vr5kEEUF6M8U7AgSKBVppXyNQBoWnyb1vMqedzN3ha"],"assertionMethod":["did:key:z6Mkq5Vr5kEEUF6M8U7AgSKBVppXyNQBoWnyb1vMqedzN3ha#z6Mkq5Vr5kEEUF6M8U7AgSKBVppXyNQBoWnyb1vMqedzN3ha"],"capabilityDelegation":["did:key:z6Mkq5Vr5kEEUF6M8U7AgSKBVppXyNQBoWnyb1vMqedzN3ha#z6Mkq5Vr5kEEUF6M8U7AgSKBVppXyNQBoWnyb1vMqedzN3ha"],"capabilityInvocation":["did:key:z6Mkq5Vr5kEEUF6M8U7AgSKBVppXyNQBoWnyb1vMqedzN3ha#z6Mkq5Vr5kEEUF6M8U7AgSKBVppXyNQBoWnyb1vMqedzN3ha"],"keyAgreement":[{"id":"did:key:z6Mkq5Vr5kEEUF6M8U7AgSKBVppXyNQBoWnyb1vMqedzN3ha#z6LScqycbURGxJztJiSkK6MKZJhujV7PygbA2BHexuriMAdr","type":"X25519KeyAgreementKey2020","controller":"did:key:z6Mkq5Vr5kEEUF6M8U7AgSKBVppXyNQBoWnyb1vMqedzN3ha","publicKeyMultibase":"z6LScqycbURGxJztJiSkK6MKZJhujV7PygbA2BHexuriMAdr"}]}}, [
  'X-Powered-By',
  'Express',
  'Access-Control-Allow-Origin',
  '*',
  'Content-Type',
  'application/json; charset=utf-8',
  'Content-Length',
  '1776',
  'ETag',
  'W/"6f0-JdoCppKv4nbnXnQDbZJxlFrXG7o"',
  'Date',
  'Mon, 09 Sep 2024 18:06:31 GMT',
  'Connection',
  'keep-alive',
  'Keep-Alive',
  'timeout=5'
]);
}
