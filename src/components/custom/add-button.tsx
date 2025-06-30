'use client'

import Link from 'next/link'
import React from 'react'
import { Button } from '@/components/ui/button'
import { Icons } from './icons'

export default function AddButton({ title, path }: { title: string; path: string }) {
  return (
    <Link href={`/admin/${path}/add`}>
      <Button>
        <Icons.add className="mr-1 h-3 w-3" />
        <span>{title}</span>
      </Button>
    </Link>
  )
}
