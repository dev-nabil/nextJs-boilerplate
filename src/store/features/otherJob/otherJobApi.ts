import { api } from '@/store/api'

export const otherJobApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: builder => ({
    getSingleOtherJob: builder.query({
      query: ({ queries, id }: { queries: any; id: string }) => {
        const values = Object.values(queries || {})
        if (values.length) return `/client-recent/${id}?${new URLSearchParams(queries)}`
        return '/faq'
      },
      providesTags: ['faq']
    })
  })
})

export const { useGetSingleOtherJobQuery } = otherJobApi
