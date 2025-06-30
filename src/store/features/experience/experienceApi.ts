import { api } from '@/store/api'

export const experienceApi = api.injectEndpoints({
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  overrideExisting: module.hot?.status() === 'apply',
  endpoints: builder => ({
    createSellerExperience: builder.mutation({
      query: data => {
        return {
          url: `/experience`,
          method: 'POST',
          body: data
        }
      },
      invalidatesTags: ['seller']
    }),
    updateSellerExperience: builder.mutation({
      query: ({ data, id }) => {
        return {
          url: `/experience/${id}`,
          method: 'PATCH',
          body: data
        }
      },
      invalidatesTags: ['seller']
    }),
    deleteSellerExperience: builder.mutation({
      query: id => {
        return {
          url: `/experience/${id}`,
          method: 'DELETE'
        }
      },
      invalidatesTags: ['seller']
    })
  })
})

export const { useUpdateSellerExperienceMutation, useCreateSellerExperienceMutation, useDeleteSellerExperienceMutation } = experienceApi
