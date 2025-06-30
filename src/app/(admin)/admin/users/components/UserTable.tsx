'use client'

import DataTable from '@/components/tables/data-table'
import { useUpdateOneSellerMutation } from '@/store/features/seller/sellerApi'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { columns } from '../../../../../components/tables/user/columns'
import NidViewerModal from './nid-viewer-modal'

interface UserTableProps {
  data: any[]
  loading?: boolean
  refetch: () => void
  totalItems: number
  pageNo: number
  pageLimit: number
  pageCount: number
}

export default function UserTable({ data, loading = false, refetch, totalItems, pageLimit, pageCount }: UserTableProps) {
  const [nidModalOpen, setNidModalOpen] = useState(false)
  const [selectedSeller, setSelectedSeller] = useState<any>(null)

  // Add the updateSeller mutation
  const [updateSeller, { isLoading: isUpdatingSeller }] = useUpdateOneSellerMutation()

  const handleViewNid = (seller: any) => {
    setSelectedSeller(seller)
    setNidModalOpen(true)
  }

  // Implement the onVerify function
  const handleVerifySeller = async (sellerId: string) => {
    try {
      await updateSeller({
        id: sellerId,
        data: {
          verified: true,
          verificationStatus: 'complete'
        }
      }).unwrap()

      toast.success('Seller has been verified successfully')
      refetch()
      return Promise.resolve()
    } catch (error: any) {
      console.error('Error verifying seller:', error)
      toast.error(error?.data?.message || 'Failed to verify seller')
      return Promise.reject(error)
    }
  }

  // Implement the onDecline function
  const handleDeclineSeller = async (sellerId: string, reason: string) => {
    try {
      await updateSeller({
        id: sellerId,
        data: {
          verified: false,
          verificationStatus: 'failed',
          verificationReason: reason
        }
      }).unwrap()

      toast.success('Seller verification has been declined')
      refetch()
      return Promise.resolve()
    } catch (error: any) {
      console.error('Error declining seller:', error)
      toast.error(error?.data?.message || 'Failed to decline seller verification')
      return Promise.reject(error)
    }
  }

  // Process data to include necessary information for the table
  const processedData = data?.map(item => {
    const isSeller = item.user?.role?.name === 'seller'
    const isBuyer = item.user?.role?.name === 'buyer'

    // Common user data
    const userData = {
      id: item.userId,
      name: item.user?.name || '',
      email: item.user?.email || '',
      role: item.user?.role?.name || '',
      status: item.user?.status || '',
      blocked: item.user?.blocked || false,
      createdAt: item.user?.createdAt || item.createdAt,
      address: item.user?.address || {}
    }

    // Add seller-specific data if the user is a seller
    if (isSeller) {
      return {
        ...userData,
        verified: item.verified || false,
        verificationStatus: item.verificationStatus || 'not_applied',
        nid: item.nid,
        nidFront: item.nidFront,
        nidBack: item.nidBack,
        onViewNid: () => handleViewNid(item)
      }
    }

    // Add buyer-specific data if the user is a buyer
    if (isBuyer) {
      return {
        ...userData,
        paymentVerified: item.paymentVerified || false,
        totalSpent: item.totalSpent || '0',
        completedProjects: item.completedProjects || 0
      }
    }

    return userData
  })

  return (
    <>
      <DataTable
        columns={columns}
        data={processedData}
        searchKey="email"
        loading={loading}
        totalItems={totalItems}
        refetch={refetch}
        limit={pageLimit}
        totalPages={pageCount}
      />

      {selectedSeller && (
        <NidViewerModal
          isOpen={nidModalOpen}
          onClose={() => setNidModalOpen(false)}
          seller={selectedSeller}
          onVerify={handleVerifySeller}
          onDecline={handleDeclineSeller}
        />
      )}
    </>
  )
}
