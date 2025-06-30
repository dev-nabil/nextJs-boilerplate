import { api } from '@/store/api'

export const contactApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: builder => ({
    addContract: builder.mutation({
      query: data => {
        return {
          url: `/contract`,
          method: 'POST',
          body: data
        }
      },
      invalidatesTags: ['contract', 'project', 'seller']
    }),
    getContracts: builder.query({
      query: queries => {
        const values = Object.values(queries)
        if (values.length) return `/contract?${new URLSearchParams(queries)}`
        return '/contract'
      },
      providesTags: ['contract']
    }),
    getSingleContract: builder.query({
      query: (id: string) => `/contract/${id}`,
      providesTags: ['contract']
    }),
    updateContract: builder.mutation({
      query: ({ id, data }) => {
        return {
          url: `/contract/${id}`,
          method: 'PATCH',
          body: data
        }
      },
      invalidatesTags: ['contract']
    }),
    deleteContract: builder.mutation({
      query: id => {
        return {
          url: `/contract/${id}`,
          method: 'DELETE'
        }
      },
      invalidatesTags: ['contract']
    }),
    statusUpdateContract: builder.mutation({
      query: ({ id, status }) => {
        return {
          url: `/contract/${status}/${id}`,
          method: 'PATCH'
        }
      },
      invalidatesTags: ['contract', 'project', 'seller']
    })
  })
})

export const {
  useAddContractMutation,
  useDeleteContractMutation,
  useGetContractsQuery,
  useGetSingleContractQuery,
  useUpdateContractMutation,
  useStatusUpdateContractMutation
} = contactApi
