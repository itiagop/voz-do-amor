import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'
import { generateToken as edgeGenerate, verifyToken as edgeVerify } from './auth-edge'
import type { UserPayload } from './auth-edge'

export type { UserPayload }

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export async function generateToken(payload: UserPayload): Promise<string> {
  return edgeGenerate(payload)
}

export async function verifyToken(token: string): Promise<UserPayload | null> {
  return edgeVerify(token)
}

export function getTokenFromCookies(): string | undefined {
  const cookieStore = cookies()
  return cookieStore.get('token')?.value
}

export async function getUserFromCookies(): Promise<UserPayload | null> {
  const token = getTokenFromCookies()
  if (!token) return null
  return edgeVerify(token)
}
