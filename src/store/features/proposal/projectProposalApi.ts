import { api } from '@/store/api'

export const projectProposalApi = api.injectEndpoints({
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  overrideExisting: module.hot?.status() === 'apply',

  endpoints: builder => ({
    getProposal: builder.query({
      query: queries => {
        const values = Object.values(queries)
        if (values.length) return `/proposal?${new URLSearchParams(queries)}`
        return '/proposal'
      },
      providesTags: ['project', 'proposal']
    }),
    getSingleProposal: builder.query({
      query: (id: string) => `/proposal/${id}`,
      providesTags: ['project', 'proposal']
    }),

    addProjectProposal: builder.mutation({
      query: data => {
        return {
          url: `/proposal`,
          method: 'POST',
          body: data
        }
      },
      invalidatesTags: ['project', 'proposal']
    }),
    // update proposal
    updateProjectProposal: builder.mutation({
      query: ({ id, data }: { id: string; data: any }) => ({
        url: `/proposal/${id}`,
        method: 'PATCH',
        body: data
      }),
      invalidatesTags: ['project', 'proposal', 'seller']
    }),
    deleteProposal: builder.mutation({
      query: id => ({
        url: `proposal/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['project', 'proposal', 'seller']
    })
  })
})

export const {
  useAddProjectProposalMutation,
  useUpdateProjectProposalMutation,
  useGetProposalQuery,
  useGetSingleProposalQuery,
  useDeleteProposalMutation
} = projectProposalApi
