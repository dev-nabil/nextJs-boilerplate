import { api } from '@/store/api'

export const settingsApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: builder => ({
    getSettings: builder.query({
      query: query => {
        return {
          url: `/settings`,
          method: 'GET',
          params: query
        }
      },
      providesTags: ['settings']
    }),
    getSettingsPublic: builder.query({
      query: () => {
        return {
          url: `/settings/public`,
          method: 'GET'
        }
      },
      providesTags: ['settings']
    }),
    updateSettings: builder.mutation({
      query: data => {
        return {
          url: `/settings`,
          method: 'PATCH',
          body: data
        }
      },
      invalidatesTags: ['settings']
    })
  })
})

export const { useGetSettingsQuery, useUpdateSettingsMutation, useGetSettingsPublicQuery } = settingsApi
