import { generateToken, verifyToken } from '../src/lib/auth-edge'

async function main() {
  const token = await generateToken({ id: '1', name: 'Test', email: 'test@test.com', role: 'admin' })
  console.log('Token:', token)

  const result = await verifyToken(token)
  console.log('Verify success:', JSON.stringify(result))

  const badResult = await verifyToken(token + 'x')
  console.log('Verify bad token:', badResult)

  const oldToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNtcW1uZXN1ZDAwMDg1bG9qeDRzb3VkZjAiLCJuYW1lIjoiQWRtaW5pc3RyYWRvciIsImVtYWlsIjoiYWRtaW5AYWRtaW4uY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzgxOTc4MTMzLCJleHAiOjE3ODI1ODI5MzN9.WCWulNsK7ZqGyhxSZ1SAwa2P0U8ECN7IBClQutdIfhY'
  const oldResult = await verifyToken(oldToken)
  console.log('Old token verify:', JSON.stringify(oldResult))
}

main().catch(console.error)
