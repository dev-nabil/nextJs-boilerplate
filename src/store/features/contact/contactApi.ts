import { api } from '@/store/api'

export const contactApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: builder => ({
    addContact: builder.mutation({
      query: data => {
        return {
          url: `/contact`,
          method: 'POST',
          body: data
        }
      },
      invalidatesTags: ['contact']
    }),
    getContacts: builder.query({
      query: queries => {
        const values = Object.values(queries)
        if (values.length) return `/contact?${new URLSearchParams(queries)}`
        return '/contact'
      },
      providesTags: ['contact']
    }),
    getSingleContact: builder.query({
      query: (id: string) => `/contact/${id}`,
      providesTags: ['contact']
    }),
    updateContact: builder.mutation({
      query: ({ id, data }) => {
        return {
          url: `/contact/${id}`,
          method: 'PATCH',
          body: data
        }
      },
      invalidatesTags: ['contact']
    }),
    deleteContact: builder.mutation({
      query: id => {
        return {
          url: `/contact/${id}`,
          method: 'DELETE'
        }
      },
      invalidatesTags: ['contact']
    })
  })
})

export const {
  useAddContactMutation,
  useDeleteContactMutation,
  useGetContactsQuery,
  useGetSingleContactQuery,
  useUpdateContactMutation
} = contactApi
