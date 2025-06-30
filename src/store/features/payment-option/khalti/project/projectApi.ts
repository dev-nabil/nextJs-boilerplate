import { api } from '@/store/api'

export const ProjectBillApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: builder => ({
    createProjectBill: builder.mutation({
      query: ({ type, id }) => {
        return {
          url: `/create-bill-khalti/${type}/${id} `,
          method: 'POST'
        }
      }
    })
  })
})

export const { useCreateProjectBillMutation } = ProjectBillApi
