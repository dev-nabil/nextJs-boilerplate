import { api } from '@/store/api'

export const reviewApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: builder => ({
    addBill: builder.mutation({
      query: data => {
        return {
          url: `/bill`,
          method: 'POST',
          body: data
        }
      },
      invalidatesTags: ['bill']
    }),
    getBills: builder.query({
      query: queries => {
        const values = Object.values(queries)
        if (values.length) return `/bill?${new URLSearchParams(queries)}`
        return '/bill'
      },
      providesTags: ['bill']
    }),
    getSingleBill: builder.query({
      query: (id: string) => `/bill/${id}`,
      providesTags: ['bill']
    }),
    updateBill: builder.mutation({
      query: ({ id, data }) => {
        return {
          url: `/bill/${id}`,
          method: 'PATCH',
          body: data
        }
      },
      invalidatesTags: ['bill']
    }),
    deleteBill: builder.mutation({
      query: id => {
        return {
          url: `/bill/${id}`,
          method: 'DELETE'
        }
      },
      invalidatesTags: ['bill']
    })
  })
})

export const { useAddBillMutation, useDeleteBillMutation, useGetBillsQuery, useGetSingleBillQuery, useUpdateBillMutation } = reviewApi
