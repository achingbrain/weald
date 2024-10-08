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

import tty from 'node:tty'
import util from 'node:util'
import humanize from 'ms'
import supportsColor from 'supports-color'
import setup from './common.js'

/**
 * This is the Node.js implementation of `debug()`.
 */

/**
 * Colors.
 */

let colors = [6, 2, 3, 4, 5, 1]

if (supportsColor.stderr !== false && (supportsColor.stderr ?? supportsColor).level >= 2) {
  colors = [
    20,
    21,
    26,
    27,
    32,
    33,
    38,
    39,
    40,
    41,
    42,
    43,
    44,
    45,
    56,
    57,
    62,
    63,
    68,
    69,
    74,
    75,
    76,
    77,
    78,
    79,
    80,
    81,
    92,
    93,
    98,
    99,
    112,
    113,
    128,
    129,
    134,
    135,
    148,
    149,
    160,
    161,
    162,
    163,
    164,
    165,
    166,
    167,
    168,
    169,
    170,
    171,
    172,
    173,
    178,
    179,
    184,
    185,
    196,
    197,
    198,
    199,
    200,
    201,
    202,
    203,
    204,
    205,
    206,
    207,
    208,
    209,
    214,
    215,
    220,
    221
  ]
}

/**
 * Build up the default `inspectOpts` object from the environment variables.
 *
 * $ DEBUG_COLORS=no DEBUG_DEPTH=10 DEBUG_SHOW_HIDDEN=enabled node script.js
 */

const inspectOpts = Object.keys(process.env).filter(key => {
  return /^debug_/i.test(key)
}).reduce<Record<string, any>>((obj, key) => {
  // Camel-case
  const prop = key
    .substring(6)
    .toLowerCase()
    .replace(/_([a-z])/g, (_, k) => {
      return k.toUpperCase()
    })

  // Coerce string value into JS value
  let val: any = process.env[key]
  if (/^(yes|on|true|enabled)$/i.test(val)) {
    val = true
  } else if (/^(no|off|false|disabled)$/i.test(val)) {
    val = false
  } else if (val === 'null') {
    val = null
  } else {
    val = Number(val)
  }

  obj[prop] = val
  return obj
}, {})

/**
 * Is stdout a TTY? Colored output is enabled when `true`.
 */

function useColors (): boolean {
  return 'colors' in inspectOpts
    ? Boolean(inspectOpts.colors)
    : tty.isatty(process.stderr.fd)
}

/**
 * Adds ANSI color escape codes if enabled.
 */
function formatArgs (this: any, args: any[]): void {
  const {
    namespace: name, useColors
  } = this

  if (useColors === true) {
    const c = this.color
    const colorCode = '\u001B[3' + (c < 8 ? c : '8;5;' + c)
    const prefix = `  ${colorCode};1m${name} \u001B[0m`

    args[0] = prefix + args[0].split('\n').join('\n' + prefix)
    args.push(colorCode + 'm+' + humanize(this.diff) + '\u001B[0m')
  } else {
    args[0] = getDate() + name + ' ' + args[0]
  }
}

function getDate (): string {
  if (inspectOpts.hideDate != null) {
    return ''
  }
  return new Date().toISOString() + ' '
}

/**
 * Invokes `util.format()` with the specified arguments and writes to stderr.
 */
function log (...args: any[]): boolean {
  return process.stderr.write(util.format(...args) + '\n')
}

/**
 * Save `namespaces`.
 *
 * @param {string} namespaces
 */
function save (namespaces: string): void {
  if (namespaces != null) {
    process.env.DEBUG = namespaces
  } else {
    // If you set a process.env field to null or undefined, it gets cast to the
    // string 'null' or 'undefined'. Just delete instead.
    delete process.env.DEBUG
  }
}

/**
 * Load `namespaces`.
 *
 * @returns {string} returns the previously persisted debug modes
 */
function load (): string | undefined {
  return process.env.DEBUG
}

/**
 * Init logic for `debug` instances.
 *
 * Create a new `inspectOpts` object in case `useColors` is set
 * differently for a particular `debug` instance.
 */

function init (debug: any): void {
  debug.inspectOpts = {}

  const keys = Object.keys(inspectOpts)
  for (let i = 0; i < keys.length; i++) {
    debug.inspectOpts[keys[i]] = inspectOpts[keys[i]]
  }
}

function setupFormatters (formatters: any): void {
  /**
   * Map %o to `util.inspect()`, all on a single line.
   */
  formatters.o = function (v: any): string {
    this.inspectOpts.colors = this.useColors
    return util.inspect(v, this.inspectOpts)
      .split('\n')
      .map(str => str.trim())
      .join(' ')
  }

  /**
   * Map %O to `util.inspect()`, allowing multiple lines if needed.
   */
  formatters.O = function (v: any): string {
    this.inspectOpts.colors = this.useColors
    return util.inspect(v, this.inspectOpts)
  }
}

export default setup({ init, log, formatArgs, save, load, useColors, setupFormatters, colors, inspectOpts })
