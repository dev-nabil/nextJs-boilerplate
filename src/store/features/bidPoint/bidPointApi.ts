import { api } from '@/store/api'

export const bidPointApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: builder => ({
    getBidPoint: builder.query({
      query: queries => {
        const values = Object.values(queries)
        if (values.length) return `/payment/bid-point?${new URLSearchParams(queries)}`
        return '/payment/bid-point'
      },
      providesTags: ['bid-point']
    }),

    getSingleBidPoint: builder.query({
      query: (id: string) => `/payment/bid-point/${id}`,
      providesTags: ['bid-point']
    })
  })
})

export const { useGetBidPointQuery, useGetSingleBidPointQuery } = bidPointApi
