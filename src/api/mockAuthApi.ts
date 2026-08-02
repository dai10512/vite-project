const NETWORK_DELAY_MS = 600

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function encodeToken(username: string) {
  return btoa(`${username}:${Date.now()}`)
}

function decodeToken(token: string): string {
  const [username] = atob(token).split(':')
  return username
}

export async function mockLoginApi(username: string): Promise<{ token: string }> {
  await wait(NETWORK_DELAY_MS)
  return { token: encodeToken(username) }
}

export async function mockVerifyTokenApi(token: string): Promise<{ username: string }> {
  await wait(NETWORK_DELAY_MS)
  try {
    const username = decodeToken(token)
    if (!username) throw new Error('invalid token')
    return { username }
  } catch {
    throw new Error('セッションが無効です')
  }
}
