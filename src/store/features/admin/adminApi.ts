import { api } from '@/store/api'

export const adminApi = api.injectEndpoints({
  endpoints: builder => ({
    createAdmin: builder.mutation({
      query: data => {
        return {
          url: `/admin`,
          method: 'POST',
          body: data
        }
      },
      invalidatesTags: ['Admin', 'User']
    }),
    getAllAdmins: builder.query({
      query: queries => {
        const values = Object.values(queries || {})
        if (values.length) return `/admin?${new URLSearchParams(queries)}`
        return '/admin'
      },
      providesTags: ['Admin']
    }),
    getAdminById: builder.query({
      query: id => `/admin/${id}`,
      providesTags: ['Admin']
    }),
    updateAdminAccessLevels: builder.mutation({
      query: ({ id, accessLevels }) => ({
        url: `/admin/${id}`,
        method: 'PATCH',
        body: { accessLevels }
      }),
      invalidatesTags: ['Admin', 'User']
    })
  })
})

export const { useCreateAdminMutation, useGetAllAdminsQuery, useGetAdminByIdQuery, useUpdateAdminAccessLevelsMutation } = adminApi
