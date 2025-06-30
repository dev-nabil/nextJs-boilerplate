'use server'

import { revalidatePath, revalidateTag } from 'next/cache'

export async function tagRevalidate(tag: string[]) {
  const revalidate = tag
  if (tag.length > 0) {
    const revalidatePromises = revalidate.map((k: string) => revalidateTag(k))
    await Promise.all(revalidatePromises)
  }
}
export async function pathRevalidate(path: string[]) {
  const revalidate = path
  if (path.length > 0) {
    const revalidatePromises = revalidate.map((k: string) => revalidatePath(k))
    await Promise.all(revalidatePromises)
  }
}
