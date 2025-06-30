import { api } from '@/store/api'

export const contactApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: builder => ({
    addDispute: builder.mutation({
      query: data => {
        return {
          url: `/dispute`,
          method: 'POST',
          body: data
        }
      },
      invalidatesTags: ['dispute']
    }),
    getDisputes: builder.query({
      query: queries => {
        const values = Object.values(queries)
        if (values.length) return `/dispute?${new URLSearchParams(queries)}`
        return '/dispute'
      },
      providesTags: ['dispute']
    }),
    getSingleDispute: builder.query({
      query: (id: string) => `/dispute/${id}`,
      providesTags: ['dispute']
    }),
    updateDispute: builder.mutation({
      query: ({ id, data }) => {
        return {
          url: `/dispute/${id}`,
          method: 'PATCH',
          body: data
        }
      },
      invalidatesTags: ['dispute', 'pending-dispute']
    }),
    deleteDispute: builder.mutation({
      query: id => {
        return {
          url: `/dispute/${id}`,
          method: 'DELETE'
        }
      },
      invalidatesTags: ['dispute']
    }),
    createDisputeChat: builder.mutation({
      query: id => {
        return {
          url: `/dispute/${id}/chat`,
          method: 'PATCH'
        }
      },
      invalidatesTags: ['dispute']
    }),
    statusUpdateDispute: builder.mutation({
      query: ({ id, status }) => {
        return {
          url: `/dispute/${status}/${id}`,
          method: 'PATCH'
        }
      }
    })
  })
})

export const {
  useAddDisputeMutation,
  useDeleteDisputeMutation,
  useGetDisputesQuery,
  useGetSingleDisputeQuery,
  useUpdateDisputeMutation,
  useCreateDisputeChatMutation
} = contactApi
