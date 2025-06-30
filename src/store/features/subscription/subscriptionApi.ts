import { api } from '@/store/api'

export const subscriptionApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: builder => ({
    addSubscription: builder.mutation({
      query: data => {
        return {
          url: `/subscription`,
          method: 'POST',
          body: data
        }
      },
      invalidatesTags: ['subscription']
    }),

    getSubscriptions: builder.query({
      query: queries => {
        const values = Object.values(queries)
        if (values.length) return `/subscription?${new URLSearchParams(queries)}`
        return '/subscription'
      },
      providesTags: ['subscription']
    }),
    getSingleSubscription: builder.query({
      query: (id: string) => `/subscription/${id}`,
      providesTags: ['subscription']
    }),
    updateSubscription: builder.mutation({
      query: ({ id, data }) => {
        return {
          url: `/subscription/${id}`,
          method: 'PATCH',
          body: data
        }
      },
      invalidatesTags: ['subscription']
    }),
    deleteSubscription: builder.mutation({
      query: id => {
        return {
          url: `/subscription/${id}`,
          method: 'DELETE'
        }
      },
      invalidatesTags: ['subscription']
    })
  })
})

export const {
  useAddSubscriptionMutation,
  useGetSubscriptionsQuery,
  useGetSingleSubscriptionQuery,
  useUpdateSubscriptionMutation,
  useDeleteSubscriptionMutation
} = subscriptionApi
