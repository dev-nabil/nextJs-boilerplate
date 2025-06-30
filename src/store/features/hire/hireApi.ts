import { api } from '@/store/api'

export const categoryApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: builder => ({
    addHire: builder.mutation({
      query: data => {
        return {
          url: `/hire`,
          method: 'POST',
          body: data
        }
      },
      invalidatesTags: ['hire', 'project', 'seller', 'contract']
    })
  })
})

export const { useAddHireMutation } = categoryApi
