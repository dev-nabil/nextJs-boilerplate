'use client'

import { checkAccess } from '@/app/(admin)/permission/permission'
import CustomModal from '@/components/custom/CustomModal'
import { Button } from '@/components/ui/button'
import { DialogFooter } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Textarea } from '@/components/ui/textarea'
import { useCreateDisputeChatMutation, useUpdateDisputeMutation } from '@/store/features/dispute/disputeApi'
import { CheckCircle, MessageSquare, MoreHorizontal, RefreshCw, XCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import toast from 'react-hot-toast'

interface CellActionProps {
  data: any
}

// ============permission===edit=delete===========
const chatPermission = checkAccess('Dispute', 'chat').status
const resolvePermission = checkAccess('Dispute', 'resolve').status
const declinePermission = checkAccess('Dispute', 'decline').status
// ============permission===edit=delete===========

export function CellAction({ data }: CellActionProps) {
  const router = useRouter()
  const [updateStatus] = useUpdateDisputeMutation()
  const [openChat] = useCreateDisputeChatMutation()

  const [openResolveModal, setOpenResolveModal] = useState(false)
  const [openDeclineModal, setOpenDeclineModal] = useState(false)
  const [openChatModal, setOpenChatModal] = useState(false)
  const [resolveType, setResolveType] = useState<'seller' | 'buyer' | 'continue'>('seller')
  const [note, setNote] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleResolve = async (type: 'seller' | 'buyer' | 'continue') => {
    if (!note.trim()) {
      toast.error('Please provide a resolution note')
      return
    }
    setIsLoading(true)
    try {
      const updateBody: any = {
        status: 'resolved',
        note,
        paymentResolvedTo: type === 'continue' ? null : type,
        projectContinue: type === 'continue'
      }

      await updateStatus({
        id: data.id,
        data: updateBody
      }).unwrap()

      toast.success(`Dispute resolved successfully`)
      setOpenResolveModal(false)
      setNote('')
      router.refresh()
    } catch (error) {
      toast.error('Failed to resolve dispute')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDecline = async () => {
    if (!note.trim()) {
      toast.error('Please provide a decline reason')
      return
    }

    setIsLoading(true)
    try {
      await updateStatus({
        id: data.id,
        data: {
          status: 'declined',
          note
        }
      }).unwrap()

      toast.success('Dispute declined successfully')
      setOpenDeclineModal(false)
      setNote('')
      router.refresh()
    } catch (error) {
      toast.error('Failed to decline dispute')
    } finally {
      setIsLoading(false)
    }
  }

  const handleTogglePaymentRefunded = async () => {
    setIsLoading(true)
    try {
      await updateStatus({
        id: data.id,
        data: {
          paymentRefunded: !data.paymentRefunded
        }
      }).unwrap()

      toast.success(`Payment refund status updated`)
      router.refresh()
    } catch (error) {
      toast.error('Failed to update payment status')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenChat = () => {
    setIsLoading(true)
    openChat(data.id)
      .unwrap()
      .then(data => {
        router.push(`/chat?id=${data.chat.id}`)
      })
      .catch(error => {
        toast.error('Failed to open chat')
        setOpenChatModal(false)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  const getActionItems = () => {
    const items = [
      chatPermission && (
        <DropdownMenuItem key="chat" onClick={() => setOpenChatModal(true)}>
          <MessageSquare className="mr-2 h-4 w-4" />
          Open Chat
        </DropdownMenuItem>
      )
    ]

    if (data.status !== 'resolved' && data.status !== 'declined') {
      items.push(
        resolvePermission && (
          <DropdownMenuItem key="resolve" onClick={() => setOpenResolveModal(true)}>
            <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
            Resolve Dispute
          </DropdownMenuItem>
        ),
        declinePermission && (
          <DropdownMenuItem key="decline" onClick={() => setOpenDeclineModal(true)}>
            <XCircle className="mr-2 h-4 w-4 text-red-500" />
            Decline Dispute
          </DropdownMenuItem>
        )
      )
    }

    if (data.status === 'resolved' && resolvePermission) {
      items.push(
        <DropdownMenuItem key="payment" onClick={handleTogglePaymentRefunded}>
          <RefreshCw className="mr-2 h-4 w-4" />
          {data.paymentRefunded ? 'Mark Payment Not Refunded' : 'Mark Payment Refunded'}
        </DropdownMenuItem>
      )
    }

    return items.filter(item => !!item)
  }

  return (
    <>
      <DropdownMenu>
        {(resolvePermission || resolvePermission || chatPermission) && (
          <>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              {getActionItems()}
            </DropdownMenuContent>
          </>
        )}
      </DropdownMenu>

      {/* Resolve Dispute Modal */}
      <CustomModal
        open={openResolveModal}
        setOpen={setOpenResolveModal}
        title="Resolve Dispute"
        description="Select resolution type and add a note"
      >
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Textarea placeholder="Resolution details..." value={note} onChange={e => setNote(e.target.value)} rows={4} />
          </div>

          <div className="grid grid-cols-1 gap-3">
            <Button onClick={() => handleResolve('seller')} disabled={isLoading}>
              Resolve to Seller
            </Button>
            <Button onClick={() => handleResolve('buyer')} disabled={isLoading}>
              Resolve to Buyer
            </Button>
            <Button onClick={() => handleResolve('continue')} disabled={isLoading}>
              Project Continue
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpenResolveModal(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </CustomModal>

      {/* Decline Dispute Modal */}
      <CustomModal
        open={openDeclineModal}
        setOpen={setOpenDeclineModal}
        title="Decline Dispute"
        description="Provide reason for declining this dispute"
      >
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Textarea placeholder="Decline reason..." value={note} onChange={e => setNote(e.target.value)} rows={4} />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpenDeclineModal(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDecline} disabled={isLoading}>
            {isLoading ? 'Declining...' : 'Confirm Decline'}
          </Button>
        </DialogFooter>
      </CustomModal>

      {/* Open Chat Modal */}
      <CustomModal
        open={openChatModal}
        setOpen={setOpenChatModal}
        title="Open Chat"
        description="Are you sure you want to open a chat for this dispute?"
      >
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpenChatModal(false)}>
            Cancel
          </Button>
          <Button onClick={handleOpenChat} disabled={isLoading}>
            {isLoading ? 'Opening...' : 'Open Chat'}
          </Button>
        </DialogFooter>
      </CustomModal>
    </>
  )
}
