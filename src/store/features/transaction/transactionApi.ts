import { api } from '@/store/api'

export const transactionApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: builder => ({
    getTransactions: builder.query({
      query: queries => {
        const values = Object.values(queries)
        if (values.length) return `/transaction?${new URLSearchParams(queries)}`
        return '/transaction'
      },
      providesTags: ['transaction']
    })
  })
})

export const { useGetTransactionsQuery } = transactionApi
