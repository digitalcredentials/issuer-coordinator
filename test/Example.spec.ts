import { expect } from 'chai'
import { Example } from '../src'

describe('Example', () => {
  it('calls function', async () => {
    const ex = new Example()
    expect(ex.hello()).to.equal('world')
  })
})
