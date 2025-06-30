import { api } from '@/store/api'

export const sellerApi = api.injectEndpoints({
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  overrideExisting: module.hot?.status() === 'apply',
  endpoints: builder => ({
    uploadFile: builder.mutation({
      query: data => {
        return {
          url: `/file`,
          method: 'POST',
          body: data
        }
      }
    }),
    deleteFile: builder.mutation({
      query: data => {
        return {
          url: `/file`,
          method: 'DELETE',
          body: data
        }
      }
    })
  })
})

export const { useUploadFileMutation, useDeleteFileMutation } = sellerApi
