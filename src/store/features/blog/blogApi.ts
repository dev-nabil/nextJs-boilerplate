import { api } from '@/store/api'

export const blogApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: builder => ({
    addBlog: builder.mutation({
      query: data => {
        return {
          url: `/blog`,
          method: 'POST',
          body: data
        }
      },
      invalidatesTags: ['blog']
    }),
    getBlogs: builder.query({
      query: queries => {
        const values = Object.values(queries)
        if (values.length) return `/blog?${new URLSearchParams(queries)}`
        return '/blog'
      },
      providesTags: ['blog']
    }),

    getBlogsSearch: builder.query({
      query: queries => {
        const values = Object.values(queries)
        if (values.length) return `/blog-search?${new URLSearchParams(queries)}`
        return '/blog-search'
      },
      providesTags: ['blog']
    }),

    getBlogsWeb: builder.query({
      query: queries => {
        const values = Object.values(queries)
        if (values.length) return `/blog?${new URLSearchParams(queries)}`
        return '/blog'
      },
      providesTags: ['blog']
    }),
    getSingleBlog: builder.query({
      query: (id: string) => `/blog/${id}`,
      providesTags: ['blog']
    }),
    updateBlog: builder.mutation({
      query: ({ id, data }) => {
        return {
          url: `/blog/${id}`,
          method: 'PATCH',
          body: data
        }
      },
      invalidatesTags: ['blog']
    }),
    deleteBlog: builder.mutation({
      query: id => {
        return {
          url: `/blog/${id}`,
          method: 'DELETE'
        }
      },
      invalidatesTags: ['blog']
    })
  })
})

export const {
  useAddBlogMutation,
  useGetBlogsQuery,
  useGetBlogsSearchQuery,
  useGetBlogsWebQuery,
  useGetSingleBlogQuery,
  useUpdateBlogMutation,
  useDeleteBlogMutation
} = blogApi
