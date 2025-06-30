import { api } from '@/store/api'

export const notificationApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: builder => ({
    addNotification: builder.mutation({
      query: data => {
        return {
          url: `/notification`,
          method: 'POST',
          body: data
        }
      },
      invalidatesTags: ['notification']
    }),
    getNotifications: builder.query({
      query: queries => {
        const values = Object.values(queries)
        if (values.length) return `/notification?${new URLSearchParams(queries)}`
        return '/notification'
      },
      providesTags: ['notification']
    }),
    readAllNotification: builder.mutation({
      query: () => {
        return {
          url: `/notification/read-all`,
          method: 'PATCH'
        }
      },
      invalidatesTags: ['notification']
    }),
    readNotification: builder.mutation({
      query: ({ id }) => {
        return {
          url: `/notification/read/${id}`,
          method: 'PATCH'
        }
      },
      invalidatesTags: ['notification']
    }),
    deleteNotification: builder.mutation({
      query: id => {
        return {
          url: `/notification/${id}`,
          method: 'DELETE'
        }
      },
      invalidatesTags: ['notification']
    }),
    moja: builder.query({
      query: queries => {
        const values = Object.values(queries)
        if (values.length) return `/moja?${new URLSearchParams(queries)}`
        return '/moja'
      },
      providesTags: ['notification']
    })
  })
})

export const {
  useAddNotificationMutation,
  useGetNotificationsQuery,
  useReadAllNotificationMutation,
  useReadNotificationMutation,
  useDeleteNotificationMutation,
  useMojaQuery
} = notificationApi
