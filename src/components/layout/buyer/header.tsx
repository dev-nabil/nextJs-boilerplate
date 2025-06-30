'use client'

import { getUserLocationName } from '@/lib/utils'
import { buyerNavLinks } from '@/routes'
import Header from '../header'

export default function BuyerHeader() {
  return <Header links={buyerNavLinks} showSearch />
}
