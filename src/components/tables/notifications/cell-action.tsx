'use client'

import DeleteButton from '@/components/custom/delete-button'
import UpdateButton from '@/components/custom/update-button'
import { Icons } from '@/components/custom/icons'

import CellActionContainer from '@/components/tables/cell-action-container'

export default function CellAction({ id }: { id: string }) {
  return (
    <CellActionContainer>
      <UpdateButton section="notifications" id={id} Icon={Icons.send} />
      <DeleteButton />
    </CellActionContainer>
  )
}
