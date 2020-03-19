/**
 * Generate URL-friendly unique ID. This method use non-secure predictable
 * random generator with bigger collision probability.
 *
 * ```js
 * import nanoid from 'nanoid/non-secure'
 * model.id = nanoid() //=> "Uakgb_J5m9g-0JDMbcJqL"
 * ```
 *
 * @param size The number of symbols in ID. Default is 21.
 * @returns Random string.
 */
export default function nanoid (size?: number): string
