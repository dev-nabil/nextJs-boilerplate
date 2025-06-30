import { api } from '@/store/api'

export const subscriptionBillApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: builder => ({
    createSubscriptionBill: builder.mutation({
      query: data => {
        return {
          url: `/order/subscription`,
          method: 'POST',
          body: data
        }
      }
      // invalidatesTags: ['subscription', 'User']
    })
  })
})

export const { useCreateSubscriptionBillMutation } = subscriptionBillApi
