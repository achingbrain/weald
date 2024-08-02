/* eslint-env mocha */

import { expect } from 'aegir/chai'
import debug from '../src/index.js'

describe('debug', () => {
  it('passes a basic sanity check', () => {
    const log = debug('test')
    log.enabled = true
    log.log = () => {}

    log('hello world')
  })

  it('allows namespaces to be a non-string value', () => {
    const log = debug('test')
    log.enabled = true
    log.log = () => {}

    debug.enable(true)
  })

  it('honors global debug namespace enable calls', () => {
    expect(debug('test:12345')).to.have.property('enabled', false)
    expect(debug('test:67890')).to.have.property('enabled', false)

    debug.enable('test:12345')
    expect(debug('test:12345')).to.have.property('enabled', true)
    expect(debug('test:67890')).to.have.property('enabled', false)
  })

  it('uses custom log function', () => {
    const log = debug('test')
    log.enabled = true

    const messages: any[] = []
    log.log = (...args: any[]) => messages.push(args)

    log('using custom log function')
    log('using custom log function again')
    log('%O', 12345)

    expect(messages).to.have.lengthOf(3)
  })

  describe('extend namespace', () => {
    it('should extend namespace', () => {
      const log = debug('foo')
      log.enabled = true
      log.log = () => {}

      const logBar = log.extend('bar')
      expect(logBar).to.have.property('namespace', 'foo:bar')
    })

    it('should extend namespace with custom delimiter', () => {
      const log = debug('foo')
      log.enabled = true
      log.log = () => {}

      const logBar = log.extend('bar', '--')

      expect(logBar).to.have.property('namespace', 'foo--bar')
    })

    it('should extend namespace with empty delimiter', () => {
      const log = debug('foo')
      log.enabled = true
      log.log = () => {}

      const logBar = log.extend('bar', '')
      expect(logBar).to.have.property('namespace', 'foobar')
    })

    it('should keep the log function between extensions', () => {
      const log = debug('foo')
      log.log = () => {}

      const logBar = log.extend('bar')
      expect(log).to.have.property('log', logBar.log)
    })
  })

  describe('rebuild namespaces string (disable)', () => {
    it('handle names, skips, and wildcards', () => {
      debug.enable('test,abc*,-abc')
      const namespaces = debug.disable()
      expect(namespaces).to.equal('test,abc*,-abc')
    })

    it('handles empty', () => {
      debug.enable('')
      const namespaces = debug.disable()
      expect(namespaces).to.equal('')
      expect(debug).to.have.property('names').that.deep.equals([])
      expect(debug).to.have.property('skips').that.deep.equals([])
    })

    it('handles all', () => {
      debug.enable('*')
      const namespaces = debug.disable()
      expect(namespaces).to.equal('*')
    })

    it('handles skip all', () => {
      debug.enable('-*')
      const namespaces = debug.disable()
      expect(namespaces).to.equal('-*')
    })

    it('names+skips same with new string', () => {
      debug.enable('test,abc*,-abc')
      const oldNames = [...debug.names]
      const oldSkips = [...debug.skips]
      const namespaces = debug.disable()
      expect(namespaces).to.equal('test,abc*,-abc')
      debug.enable(namespaces)
      expect(oldNames.map(String)).to.deep.equal(debug.names.map(String))
      expect(oldSkips.map(String)).to.deep.equal(debug.skips.map(String))
    })

    it('handles re-enabling existing instances', () => {
      debug.disable('*')
      const inst = debug('foo')
      const messages: string[] = []
      inst.log = (msg: string) => messages.push(msg.replace(/^[^@]*@([^@]+)@.*$/, '$1'))

      inst('@test@')
      expect(messages).to.deep.equal([])
      debug.enable('foo')
      expect(messages).to.deep.equal([])
      inst('@test2@')
      expect(messages).to.deep.equal(['test2'])
      inst('@test3@')
      expect(messages).to.deep.equal(['test2', 'test3'])
      debug.disable('*')
      inst('@test4@')
      expect(messages).to.deep.equal(['test2', 'test3'])
    })
  })
})
