import { api } from '@/store/api'

export const categoryApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: builder => ({
    addInvitation: builder.mutation({
      query: data => {
        return {
          url: `/invitation`,
          method: 'POST',
          body: data
        }
      },
      invalidatesTags: ['invitation', 'seller', 'contract']
    }),
    getInvitation: builder.query({
      query: queries => {
        const values = Object.values(queries)
        if (values.length) return `/invitation?${new URLSearchParams(queries)}`
        return '/invitation'
      },
      providesTags: ['invitation']
    }),
    getSingleInvitation: builder.query({
      query: (id: string) => `/invitation/${id}`,
      providesTags: ['invitation']
    }),
    updateInvitation: builder.mutation({
      query: ({ id, data }) => {
        return {
          url: `/invitation/${id}`,
          method: 'PATCH',
          body: data
        }
      },
      invalidatesTags: ['invitation', 'seller']
    }),
    deleteInvitation: builder.mutation({
      query: id => {
        return {
          url: `/invitation/${id}`,
          method: 'DELETE'
        }
      },
      invalidatesTags: ['invitation', 'seller', 'contract']
    })
  })
})

export const {
  useAddInvitationMutation,
  useDeleteInvitationMutation,
  useGetInvitationQuery,
  useGetSingleInvitationQuery,
  useUpdateInvitationMutation
} = categoryApi
