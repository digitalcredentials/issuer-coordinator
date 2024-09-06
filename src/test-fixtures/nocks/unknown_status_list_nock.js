import nock from 'nock'

export default () => {
  nock('http://localhost:4008')
    .get('/9898u')
    .reply(404, { code: 404, message: 'No status credential found for that id.' })
}
