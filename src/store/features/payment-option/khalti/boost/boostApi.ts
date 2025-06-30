import { api } from '@/store/api'

export const boostApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: builder => ({
    createBoostBill: builder.mutation({
      query: id => {
        return {
          url: `boost-payment/${id} `,
          method: 'POST'
        }
      }
    }),
    boostJob: builder.mutation({
      query: ({ data, id }) => {
        return {
          url: `/boost-project/${id}`,
          method: 'POST',
          body: data
        }
      },
      invalidatesTags: ['Project']
    }),
    profileBoost: builder.mutation({
      query: data => {
        return {
          url: `/boost`,
          method: 'POST',
          body: data
        }
      },
      invalidatesTags: ['boost']
    })
  })
})

export const { useCreateBoostBillMutation, useBoostJobMutation, useProfileBoostMutation } = boostApi
