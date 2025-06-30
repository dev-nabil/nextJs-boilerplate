import fetchData from '@/lib/fetch'
import { type Session } from '@/types/auth'
import { cookies } from 'next/headers'

export default async function getAuth(): Promise<Session> {
  const cookieStore = await cookies()

  const res = await fetchData('/admin/me', {
    exHeader: {
      cookie: cookieStore.toString()
    }
  })

  const session = (res?.data || null) as Session

  return session
}
