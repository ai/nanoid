export function nanoid(size?: number): Promise<string>

export function customAlphabet(
  alphabet: string,
  defaultSize?: number
): (size?: number) => Promise<string>

export function random(bytes: number): Promise<Uint8Array>
