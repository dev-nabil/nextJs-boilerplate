import { api } from '@/store/api'

export const commissionApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: builder => ({
    getCommission: builder.query({
      query: queries => {
        const values = Object.values(queries)
        if (values.length) return `/payment/commission?${new URLSearchParams(queries)}`
        return '/payment/commission'
      },
      providesTags: ['commission']
    })
  })
})

export const { useGetCommissionQuery } = commissionApi
