'use client'
import { LoaderCircle, Trash2, TriangleAlert, X } from 'lucide-react'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useState } from 'react'
import toast from 'react-hot-toast'

export function DeleteConfirmation({ id, deleteFunction }: { id: string; deleteFunction: any }) {
  const [modalState, setModalState] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleDelete = async () => {
    setIsLoading(true)
    try {
      await deleteFunction(id)
        .then((res: any) => {
          if (res.data) {
            toast.success(res.data.message || 'Item deleted successfully')
            setModalState(false) // Close the modal after success
          }
        })
        .catch((err: any) => {
          toast.error(err.message || 'Something went wrong')
          setModalState(false) // Close the modal if there's an error
        })
        .finally(() => {
          setIsLoading(false) // Reset the loading state
          setModalState(false) // Close the modal on success or error
        })
    } catch (error: any) {
      setIsLoading(false)
      toast.error(error.message || 'Something went wrong')
      setModalState(false) // Close the modal on error
    }
  }

  return (
    <Dialog open={modalState}>
      <DialogTrigger asChild onClick={() => setModalState(true)}>
        <Trash2 className="h-5 w-5 cursor-pointer text-red-500 hover:text-red-800" />
      </DialogTrigger>
      <DialogContent className="border-none bg-white sm:max-w-md">
        <DialogHeader className="absolute top-[10px] font-bold">
          <DialogTitle className="text-lg font-bold sm:text-xl"></DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <button
          onClick={() => setModalState(false)}
          type="button"
          className="absolute top-1 right-1 z-30 ml-auto inline-flex items-center rounded-full bg-red-500 p-1 text-base text-white hover:bg-red-600 dark:hover:bg-gray-600 dark:hover:text-white"
          data-modal-toggle="deleteModal"
        >
          <X size={18} />
        </button>

        <div className="relative rounded-lg border-none bg-white px-2 py-3 text-center sm:p-5 dark:bg-gray-800">
          <TriangleAlert className="mx-auto mb-2 h-12 w-12 text-red-500" />
          {/* </div> */}
          <p className="mb-4 py-4 font-medium text-gray-600 dark:text-gray-300">Are you sure you want to delete this item?</p>

          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={() => setModalState(false)}
              data-modal-toggle="deleteModal"
              type="button"
              className="rounded-lg border border-gray-200 bg-gray-100 px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus:z-10 focus:outline-none dark:border-gray-500 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-600"
            >
              No, cancel
            </button>

            <button
              disabled={isLoading}
              onClick={handleDelete}
              type="submit"
              className={`rounded-lg px-3 py-2 text-center text-sm font-medium text-white ${
                isLoading ? 'cursor-not-allowed bg-red-200' : 'bg-red-500 hover:bg-red-600'
              } focus:outline-none dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-900`}
            >
              <span className="flex items-center justify-center">
                {`Yes, I'm sure`} {isLoading && <LoaderCircle className="ml-2 animate-spin" />}
              </span>
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
