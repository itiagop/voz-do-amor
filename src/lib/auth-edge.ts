let _crypto: SubtleCrypto | null = null

function getWebCrypto(): SubtleCrypto {
  if (_crypto) return _crypto
  try {
    if (typeof crypto !== 'undefined' && crypto.subtle) {
      _crypto = crypto.subtle
    } else {
      _crypto = require('crypto').webcrypto.subtle
    }
  } catch {
    throw new Error('Web Crypto API not available')
  }
  return _crypto!
}

const encoder = new TextEncoder()
const decoder = new TextDecoder()
const secretBytes = encoder.encode((process.env.JWT_SECRET || 'voz-que-fica-secret-key-2026').trim())

export type UserPayload = {
  id: string
  name: string
  email: string
  role?: string
}

function toBase64Url(data: Uint8Array): string {
  return btoa(Array.from(data, b => String.fromCharCode(b)).join(''))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function fromBase64Url(str: string): Uint8Array {
  str = str.replace(/-/g, '+').replace(/_/g, '/')
  while (str.length % 4) str += '='
  return Uint8Array.from(atob(str), c => c.charCodeAt(0))
}

async function getKey(): Promise<CryptoKey> {
  return getWebCrypto().importKey('raw', secretBytes, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify'])
}

export async function generateToken(payload: UserPayload): Promise<string> {
  const header = { alg: 'HS256', typ: 'JWT' }
  const now = Math.floor(Date.now() / 1000)
  const body = { ...payload, iat: now, exp: now + 7 * 24 * 60 * 60 }
  const h = toBase64Url(encoder.encode(JSON.stringify(header)))
  const b = toBase64Url(encoder.encode(JSON.stringify(body)))
  const key = await getKey()
  const sig = await getWebCrypto().sign('HMAC', key, encoder.encode(`${h}.${b}`).buffer as ArrayBuffer)
  return `${h}.${b}.${toBase64Url(new Uint8Array(sig))}`
}

export async function verifyToken(token: string): Promise<UserPayload | null> {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    const [h, b, s] = parts
    const key = await getKey()
    const ok = await getWebCrypto().verify('HMAC', key, fromBase64Url(s).buffer as ArrayBuffer, encoder.encode(`${h}.${b}`))
    if (!ok) return null
    const body = JSON.parse(decoder.decode(fromBase64Url(b)))
    if (body.exp && body.exp < Math.floor(Date.now() / 1000)) return null
    return { id: body.id, name: body.name, email: body.email, role: body.role }
  } catch {
    return null
  }
}
