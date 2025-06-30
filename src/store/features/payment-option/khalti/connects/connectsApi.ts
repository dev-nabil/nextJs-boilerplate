import { api } from '@/store/api'

export const connectsApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: builder => ({
    createConnect: builder.mutation({
      query: data => {
        return {
          url: `/order/connects`,
          method: 'POST',
          body: data
        }
      }
    })
  })
})

export const { useCreateConnectMutation } = connectsApi
