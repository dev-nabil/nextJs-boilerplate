import { api } from '@/store/api'

export const withdrawApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: builder => ({
    addWithdraw: builder.mutation({
      query: data => ({
        url: `/withdraw`,
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['withdraw']
    }),

    getWithdraws: builder.query({
      query: queries => {
        const values = Object.values(queries || {})
        if (values.length) return `/withdraw?${new URLSearchParams(queries)}`
        return '/withdraw'
      },
      providesTags: ['withdraw']
    }),

    getSingleWithdraw: builder.query({
      query: (id: string) => `/withdraw/${id}`,
      providesTags: ['withdraw']
    }),

    updateWithdraw: builder.mutation({
      query: ({ id, data }) => ({
        url: `/withdraw/${id}`,
        method: 'PATCH',
        body: data
      }),
      invalidatesTags: ['withdraw']
    }),

    deleteWithdraw: builder.mutation({
      query: id => ({
        url: `/withdraw/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['withdraw']
    })
  })
})

export const {
  useAddWithdrawMutation,
  useGetWithdrawsQuery,
  useGetSingleWithdrawQuery,
  useUpdateWithdrawMutation,
  useDeleteWithdrawMutation
} = withdrawApi
