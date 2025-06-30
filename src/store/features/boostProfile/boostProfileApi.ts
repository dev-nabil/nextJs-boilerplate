import { api } from '@/store/api'

export const boostProjectApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: builder => ({
    getBoostProfile: builder.query({
      query: queries => {
        const values = Object.values(queries)
        if (values.length) return `/payment/boost-profile?${new URLSearchParams(queries)}`
        return '/payment/boost-profile'
      },
      providesTags: ['boost-profile']
    }),

    getSingleBoostProfile: builder.query({
      query: (id: string) => `/payment/boost-profile/${id}`,
      providesTags: ['boost-profile']
    })
  })
})

export const { useGetBoostProfileQuery, useGetSingleBoostProfileQuery } = boostProjectApi
