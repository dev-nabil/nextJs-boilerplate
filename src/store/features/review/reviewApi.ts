import { api } from '@/store/api'

export const reviewApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: builder => ({
    addReview: builder.mutation({
      query: data => {
        return {
          url: `/review`,
          method: 'POST',
          body: data
        }
      },
      invalidatesTags: ['review']
    }),
    getReviews: builder.query({
      query: queries => {
        const values = Object.values(queries)
        if (values.length) return `/review?${new URLSearchParams(queries)}`
        return '/review'
      },
      providesTags: ['review']
    }),
    getSingleReview: builder.query({
      query: (id: string) => `/review/${id}`,
      providesTags: ['review']
    }),
    updateReview: builder.mutation({
      query: ({ id, data }) => {
        return {
          url: `/review/${id}`,
          method: 'PATCH',
          body: data
        }
      },
      invalidatesTags: ['review']
    }),
    deleteReview: builder.mutation({
      query: id => {
        return {
          url: `/review/${id}`,
          method: 'DELETE'
        }
      },
      invalidatesTags: ['review']
    })
  })
})

export const { useAddReviewMutation, useDeleteReviewMutation, useGetReviewsQuery, useGetSingleReviewQuery, useUpdateReviewMutation } =
  reviewApi
