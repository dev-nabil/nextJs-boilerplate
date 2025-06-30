import { api } from '@/store/api'

export const sellerApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: builder => ({
    getSellers: builder.query({
      query: query => {
        return {
          url: `/seller`,
          method: 'GET',
          params: query
        }
      },
      providesTags: ['seller']
    }),
    getSingleSellers: builder.query({
      query: id => {
        return {
          url: `/seller/${id}`,
          method: 'GET'
        }
      },
      providesTags: ['seller', 'proposal']
    }),

    updateOneSeller: builder.mutation({
      query: ({ id, data }) => {
        return {
          url: `/seller/${id}`,
          method: 'PATCH',
          body: data
        }
      },
      invalidatesTags: ['seller']
    }),
    updateSeller: builder.mutation({
      query: data => {
        return {
          url: `/seller`,
          method: 'PATCH',
          body: data
        }
      },
      invalidatesTags: ['seller']
    }),
    updateSellerCategories: builder.mutation({
      query: data => {
        return {
          url: `/seller/categories`,
          method: 'PATCH',
          body: data
        }
      },
      invalidatesTags: ['seller']
    }),
    updateSellerCertifications: builder.mutation({
      query: data => {
        return {
          url: `/seller/certifications`,
          method: 'PATCH',
          body: data
        }
      },
      invalidatesTags: ['seller']
    }),
    createCertification: builder.mutation({
      query: data => ({
        url: `/certificate`,
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['seller']
    }),
    updateCertification: builder.mutation({
      query: ({ id, data }: { id: string; data: any }) => ({
        url: `/certificate/${id}`,
        method: 'PATCH',
        body: data
      }),
      invalidatesTags: ['seller']
    }),
    deleteCertification: builder.mutation({
      query: id => ({
        url: `certificate/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['seller']
    })
  })
})

export const {
  useGetSellersQuery,
  useGetSingleSellersQuery,
  useCreateCertificationMutation,
  useUpdateOneSellerMutation,
  useUpdateSellerMutation,
  useUpdateSellerCategoriesMutation,
  useUpdateSellerCertificationsMutation,
  useDeleteCertificationMutation,
  useUpdateCertificationMutation
} = sellerApi
