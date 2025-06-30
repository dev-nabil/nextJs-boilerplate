import { api } from '@/store/api'

export const subscriptionBuyUserApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: builder => ({
    getSubscriptionUser: builder.query({
      query: queries => {
        const values = Object.values(queries)
        if (values.length) return `/payment/subscription?${new URLSearchParams(queries)}`
        return '/payment/subscription'
      },
      providesTags: ['only-subscription']
    }),

    getSingleSubscriptionUser: builder.query({
      query: (id: string) => `/payment/subscription/${id}`,
      providesTags: ['only-subscription']
    })
  })
})

export const { useGetSubscriptionUserQuery, useGetSingleSubscriptionUserQuery } = subscriptionBuyUserApi
