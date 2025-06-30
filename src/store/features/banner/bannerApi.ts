import { api } from '@/store/api'
import type { IBanner } from '@/types'

export const bannerApi = api.injectEndpoints({
  endpoints: builder => ({
    getBanners: builder.query({
      query: queries => {
        const values = Object.values(queries)
        if (values.length) return `/banner?${new URLSearchParams(queries)}`
        return '/banner'
      },
      providesTags: ['banner']
    }),

    getBannerById: builder.query<IBanner, string>({
      query: id => `/banner/${id}`,
      providesTags: (result, error, id) => [{ type: 'banner', id }]
    }),

    createBanner: builder.mutation<any, FormData>({
      query: data => ({
        url: '/banner',
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['banner']
    }),

    updateBanner: builder.mutation<any, { id: string; data: FormData }>({
      query: ({ id, data }) => ({
        url: `/banner/${id}`,
        method: 'PATCH',
        body: data
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'banner', id }, 'banner']
    }),

    deleteBanner: builder.mutation<any, string>({
      query: id => ({
        url: `/banner/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['banner']
    })
  })
})

export const { useGetBannersQuery, useGetBannerByIdQuery, useCreateBannerMutation, useUpdateBannerMutation, useDeleteBannerMutation } =
  bannerApi
