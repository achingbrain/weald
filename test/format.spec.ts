import { expect } from 'aegir/chai'
import { format } from '../src/format.js'

describe('format', function () {
  it('should use format string', () => {
    const res = format('foo')
    expect(res).to.equal('foo')
  })

  it('should format string (%s)', () => {
    const res = format('%s', 'foo')
    expect(res).to.equal('foo')
  })

  it('should format multiple strings (%s:%s)', () => {
    const res = format('%s:%s', 'foo', 'bar')
    expect(res).to.equal('foo:bar')
  })

  it('should format digit as NaN (%d)', () => {
    const res = format('%d', 'foo')
    expect(res).to.equal('NaN')
  })

  it('should format digit (%d)', () => {
    const res = format('%d', '16')
    expect(res).to.equal('16')
  })

  it('should format json string (%j)', () => {
    const res = format('%j', 'foo')
    expect(res).to.equal('"foo"')
  })

  it('should format json array (%j)', () => {
    const res = format('%j', [1, 2, 3])
    expect(res).to.equal('[1,2,3]')
  })

  it('should format object string (%o)', () => {
    const res = format('%o', 'foo')
    expect(res).to.equal('foo')
  })

  it('should format error (%o)', () => {
    const res = format('%o', new Error('mock error'))
    expect(res).to.equal('Error: mock error')
  })

  it('should format object array (%o)', () => {
    const res = format('%o', [1, 2, 3])
    expect(res).to.equal('[1,2,3]')
  })

  it('should format escaped string (%s)', () => {
    const res = format('%%s', 'foo')
    expect(res).to.equal('%s foo')
  })
})
