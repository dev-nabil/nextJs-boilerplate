import React from 'react'
import { Badge } from '@/components/ui/badge'

export default function StatusBadge({ status }: { status: string }) {
  return <Badge variant={status === 'active' ? 'default' : 'destructive'}>{status === 'active' ? 'Active' : 'Inactive'}</Badge>
}
