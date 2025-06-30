import { api } from '@/store/api'

export const boostProjectApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: builder => ({
    getBoostProject: builder.query({
      query: queries => {
        const values = Object.values(queries)
        if (values.length) return `/payment/boost-project?${new URLSearchParams(queries)}`
        return '/payment/boost-project'
      },
      providesTags: ['boost-project']
    }),

    getSingleBoostProject: builder.query({
      query: (projectId: string) => `/payment/boost-project/${projectId}`,
      providesTags: ['boost-project']
    })
  })
})

export const { useGetBoostProjectQuery, useGetSingleBoostProjectQuery } = boostProjectApi
