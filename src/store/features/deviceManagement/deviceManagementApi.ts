import { api } from '@/store/api'

export const deviceManagementApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: builder => ({
    singleLogout: builder.mutation({
      query: data => ({
        url: `/user/signout-device`,
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['devices']
    }),
    AllLogout: builder.mutation({
      query: () => ({
        url: `/user/signout-all`,
        method: 'POST'
      }),
      invalidatesTags: ['devices']
    }),
    getDevices: builder.query({
      query: () => {
        return '/user/devices'
      },
      providesTags: ['devices']
    })
  })
})

export const { useGetDevicesQuery, useAllLogoutMutation, useSingleLogoutMutation } = deviceManagementApi
