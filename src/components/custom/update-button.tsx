import Link from 'next/link'

import { Button } from '@/components/ui/button'

import { FC } from 'react'

type Props = {
  Icon?: FC<{ className?: string }>
  section: string
  id: string
}

export default function UpdateButton({ section, id }: Props) {
  return (
    <Link href={`/admin/${section}/update/${id}`}>
      <Button size="icon" variant="outline"></Button>
    </Link>
  )
}
