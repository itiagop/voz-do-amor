const JWT_SECRET = new TextEncoder().encode((process.env.JWT_SECRET || 'voz-que-fica-secret-key-2026').trim())

export type UserPayload = {
  id: string
  name: string
  email: string
  role?: string
}

async function base64UrlEncode(data: Uint8Array): Promise<string> {
  const base64 = btoa(Array.from(data, b => String.fromCharCode(b)).join(''))
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

async function base64UrlDecode(str: string): Promise<ArrayBuffer> {
  str = str.replace(/-/g, '+').replace(/_/g, '/')
  while (str.length % 4) str += '='
  return new Uint8Array(Array.from(atob(str), c => c.charCodeAt(0))).buffer as ArrayBuffer
}

async function getKey(): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    JWT_SECRET,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  )
}

export async function generateToken(payload: UserPayload): Promise<string> {
  const header = { alg: 'HS256', typ: 'JWT' }
  const now = Math.floor(Date.now() / 1000)
  const body = { ...payload, iat: now, exp: now + 7 * 24 * 60 * 60 }

  const headerEncoded = await base64UrlEncode(new TextEncoder().encode(JSON.stringify(header)))
  const bodyEncoded = await base64UrlEncode(new TextEncoder().encode(JSON.stringify(body)))

  const key = await getKey()
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(`${headerEncoded}.${bodyEncoded}`).buffer as ArrayBuffer)
  const sigEncoded = await base64UrlEncode(new Uint8Array(signature))

  return `${headerEncoded}.${bodyEncoded}.${sigEncoded}`
}

export async function verifyToken(token: string): Promise<UserPayload | null> {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null

    const [headerEncoded, bodyEncoded, sigEncoded] = parts

    const key = await getKey()
    const valid = await crypto.subtle.verify(
      'HMAC',
      key,
      await base64UrlDecode(sigEncoded),
      new TextEncoder().encode(`${headerEncoded}.${bodyEncoded}`).buffer as ArrayBuffer,
    )
    if (!valid) return null

    const body = JSON.parse(new TextDecoder().decode(await base64UrlDecode(bodyEncoded)))
    const now = Math.floor(Date.now() / 1000)
    if (body.exp && body.exp < now) return null

    return { id: body.id, name: body.name, email: body.email, role: body.role }
  } catch {
    return null
  }
}
