/**
 * @packageDocumentation
 *
 * This module is a fork of the [debug](https://www.npmjs.com/package/debug) module. It has been converted to TypeScript and the output is ESM.
 *
 * It is API compatible with no extra features or bug fixes, it should only be used if you want a 100% ESM application.
 *
 * ESM should be arriving in `debug@5.x.x` so this module can be retired after that.
 *
 * Please see [debug](https://www.npmjs.com/package/debug) for API details.
 */

/**
 * Module dependencies.
 */
import weald from './node.js'
import type ms from 'ms'

export interface Options {
  /**
   * Receives log lines. The default transport writes the log line to
   * `process.stderr`, `console.debug` or `console.log` depending on what is
   * available in the environment.
   *
   * The args are not formatted - they can be passed to `util.format` from
   * Node.js or to `format` exported from this module as `weald/format`.
   *
   * @example Receiving log lines
   *
   * ```ts
   * import debug from 'weald'
   * import { format } from 'weald/format'
   *
   * const logger = debug('my-namespace', {
   *   onLog (...args: any[]) {
   *     const line = format(...args)
   *     // do something with `line`
   *   }
   * })
   * ```
   */
  onLog?(...args: any[]): void
}

export interface Debug {
  (namespace: string, options?: Options): Debugger
  coerce(val: any): any
  disable(...args: string[]): string
  enable(namespaces: string | boolean): void
  enabled(namespaces: string): boolean
  formatArgs(this: Debugger, args: any[]): void
  log(fmt: string, ...args: any[]): unknown
  selectColor(namespace: string): string | number
  humanize: typeof ms
  useColors(): boolean

  names: RegExp[]
  skips: RegExp[]

  formatters: Formatters

  inspectOpts?: {
    hideDate?: boolean | number | null
    colors?: boolean | number | null
    depth?: boolean | number | null
    showHidden?: boolean | number | null
  }
}

export type Formatters = Record<string, (v: any) => string>

export interface Debugger {
  (formatter: any, ...args: any[]): void

  color: string
  diff: number
  enabled: boolean
  log(fmt: string, ...args: any[]): unknown
  namespace: string
  destroy(): boolean
  extend(namespace: string, delimiter?: string): Debugger
  useColors(): boolean
}

export default weald
