import { api } from '@/store/api'

export const categoryApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: builder => ({
    addCategory: builder.mutation({
      query: data => {
        return {
          url: `/category`,
          method: 'POST',
          body: data
        }
      },
      invalidatesTags: ['category']
    }),
    getCategories: builder.query({
      query: queries => {
        const values = Object.values(queries)
        if (values.length) return `/category?${new URLSearchParams(queries)}`
        return '/category'
      },
      providesTags: ['category']
    }),
    getSingleCategory: builder.query({
      query: (id: string) => `/category/${id}`,
      providesTags: ['category']
    }),
    updateCategory: builder.mutation({
      query: ({ id, data }) => {
        return {
          url: `/category/${id}`,
          method: 'PATCH',
          body: data
        }
      },
      invalidatesTags: ['category']
    }),
    updateCategoryOrder: builder.mutation({
      query: ({ data }) => {
        return {
          url: `/categories/update-many`,
          method: 'PATCH',
          body: data
        }
      },
      invalidatesTags: ['category']
    }),
    deleteCategory: builder.mutation({
      query: id => {
        return {
          url: `/category/${id}`,
          method: 'DELETE'
        }
      },
      invalidatesTags: ['category']
    })
  })
})

export const {
  useAddCategoryMutation,
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
  useGetSingleCategoryQuery,
  useUpdateCategoryMutation,
  useUpdateCategoryOrderMutation
} = categoryApi
