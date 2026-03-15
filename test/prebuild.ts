import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { minify } from 'terser'

import { urlAlphabet } from '../url-alphabet/index.js'

export const BUILD_PATH = join(import.meta.dirname, '..', 'nanoid.js')

export async function prebuild(): Promise<string> {
  let js = await readFile(join(import.meta.dirname, '..', 'index.browser.js'))
  let func = js.toString().match(/(export let nanoid [\W\w]*$)/)![1]
  let all =
    `let a = '${urlAlphabet}'\n` +
    `${func.replaceAll('scopedUrlAlphabet', 'a')}`
  let { code } = await minify(all)
  return code!
}
