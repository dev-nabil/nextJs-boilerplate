import { api } from '@/store/api'

export const faqApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: builder => ({
    addFaq: builder.mutation({
      query: data => ({
        url: `/faq`,
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['faq']
    }),
    getFaqs: builder.query({
      query: queries => {
        const values = Object.values(queries || {})
        if (values.length) return `/faq?${new URLSearchParams(queries)}`
        return '/faq'
      },
      providesTags: ['faq']
    }),
    getSingleFaq: builder.query({
      query: (id: string) => `/faq/${id}`,
      providesTags: ['faq']
    }),
    updateFaq: builder.mutation({
      query: ({ id, data }) => ({
        url: `/faq/${id}`,
        method: 'PATCH',
        body: data
      }),
      invalidatesTags: ['faq']
    }),
    deleteFaq: builder.mutation({
      query: id => ({
        url: `/faq/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['faq']
    })
  })
})

export const { useAddFaqMutation, useGetFaqsQuery, useGetSingleFaqQuery, useUpdateFaqMutation, useDeleteFaqMutation } = faqApi
