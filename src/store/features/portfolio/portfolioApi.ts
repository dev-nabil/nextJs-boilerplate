import { api } from '@/store/api'

export const portfolioApi = api.injectEndpoints({
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  overrideExisting: module.hot?.status() === 'apply',
  endpoints: builder => ({
    getPortfolios: builder.query({
      query: query => {
        return {
          url: `/personal-project`,
          method: 'GET',
          params: query
        }
      },
      providesTags: ['portfolio']
    }),
    getSinglePortfolios: builder.query({
      query: id => {
        return {
          url: `/personal-project/${id}`,
          method: 'GET'
        }
      },
      providesTags: ['portfolio']
    }),
    createPortfolio: builder.mutation({
      query: data => {
        return {
          url: `/personal-project`,
          method: 'POST',
          body: data
        }
      },
      invalidatesTags: ['portfolio']
    }),
    updatePortfolio: builder.mutation({
      query: ({ id, data }) => {
        return {
          url: `/personal-project/${id}`,
          method: 'PATCH',
          body: data
        }
      },
      invalidatesTags: ['portfolio']
    }),
    deletePortfolio: builder.mutation({
      query: id => {
        return {
          url: `/personal-project/${id}`,
          method: 'DELETE'
        }
      },
      invalidatesTags: ['portfolio']
    })
  })
})

export const {
  useGetPortfoliosQuery,
  useGetSinglePortfoliosQuery,
  useCreatePortfolioMutation,
  useUpdatePortfolioMutation,
  useDeletePortfolioMutation
} = portfolioApi
