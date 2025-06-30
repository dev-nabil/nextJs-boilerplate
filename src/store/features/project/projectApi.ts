import { api } from '@/store/api'

export const projectApi = api.injectEndpoints({
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  overrideExisting: module.hot?.status() === 'apply',
  endpoints: builder => ({
    addProject: builder.mutation({
      query: data => {
        return {
          url: `/project`,
          method: 'POST',
          body: data
        }
      },
      invalidatesTags: ['project']
    }),
    getProjects: builder.query({
      query: queries => {
        const values = Object.values(queries)
        if (values.length) return `/project?${new URLSearchParams(queries)}`
        return '/project'
      },
      providesTags: ['project']
    }),
    getSingleProject: builder.query({
      query: (id: string) => `/project/${id}`,
      providesTags: ['project']
    }),

    getSingleProjectWithProposal: builder.query({
      query: query => ({
        url: `/proposal`,
        method: 'GET',
        params: query
      }),
      providesTags: ['project']
    }),

    updateProject: builder.mutation({
      query: ({ id, data }) => {
        return {
          url: `/project/${id}`,
          method: 'PATCH',
          body: data
        }
      },
      invalidatesTags: ['project']
    }),
    deleteProject: builder.mutation({
      query: id => {
        return {
          url: `/project/${id}`,
          method: 'DELETE'
        }
      },
      invalidatesTags: ['project']
    })
  })
})

export const {
  useAddProjectMutation,
  useDeleteProjectMutation,
  useUpdateProjectMutation,
  useGetProjectsQuery,
  useGetSingleProjectQuery,
  useGetSingleProjectWithProposalQuery
} = projectApi
