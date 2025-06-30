import { api } from '@/store/api'

export const adminAnalyticsApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: builder => ({
    getAnalytics: builder.query({
      query: queries => {
        const values = Object.values(queries)
        if (values.length) return `/admin/dashboard?${new URLSearchParams(queries)}`
        return '/admin/dashboard'
      },
      providesTags: ['analytics']
    }),
    getPendingVerification: builder.query({
      query: queries => {
        const values = Object.values(queries)
        if (values.length) return `/admin/pending-verification?${new URLSearchParams(queries)}`
        return '/admin/pending-verification'
      },
      providesTags: ['pending-verification']
    }),
    getPendingDispute: builder.query({
      query: queries => {
        const values = Object.values(queries)
        if (values.length) return `/admin/pending-dispute?${new URLSearchParams(queries)}`
        return '/admin/pending-dispute'
      },
      providesTags: ['pending-dispute']
    })
  })
})

export const { useGetAnalyticsQuery, useGetPendingDisputeQuery, useGetPendingVerificationQuery } = adminAnalyticsApi
