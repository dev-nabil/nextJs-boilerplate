import { api } from "../api"
import type { PaginatedResponse } from "@/types/api"

/**
 * Demo data types for examples
 */
export interface DemoUser {
  id: string
  name: string
  email: string
  role: string
  status: "active" | "inactive" | "pending"
  avatar?: string
  createdAt: string
}

export interface DemoPost {
  id: string
  title: string
  content: string
  author: string
  status: "published" | "draft" | "archived"
  tags: string[]
  createdAt: string
  updatedAt: string
}

/**
 * Demo API endpoints for learning RTK Query
 * These endpoints demonstrate various RTK Query patterns and best practices
 *
 * @example
 * ```typescript
 * // Fetch users with pagination
 * const { data: users, isLoading } = useGetDemoUsersQuery({ page: 1, limit: 10 })
 *
 * // Create new user
 * const [createUser, { isLoading: isCreating }] = useCreateDemoUserMutation()
 * await createUser({ name: 'John', email: 'john@example.com' })
 *
 * // Update user
 * const [updateUser] = useUpdateDemoUserMutation()
 * await updateUser({ id: '1', name: 'John Updated' })
 * ```
 */
export const demoApi = api.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Get paginated list of demo users
     * Demonstrates pagination, caching, and query parameters
     */
    getDemoUsers: builder.query<
      PaginatedResponse<DemoUser>,
      {
        page?: number
        limit?: number
        search?: string
        role?: string
        status?: string
      }
    >({
      query: ({ page = 1, limit = 10, search, role, status }) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
          ...(search && { search }),
          ...(role && { role }),
          ...(status && { status }),
        })
        return `/api/demo/users?${params.toString()}`
      },
      providesTags: (result) =>
        result
          ? [...result.data.map(({ id }) => ({ type: "Demo" as const, id })), { type: "Demo", id: "USER_LIST" }]
          : [{ type: "Demo", id: "USER_LIST" }],
      // Keep data fresh for 5 minutes
      keepUnusedDataFor: 300,
    }),

    /**
     * Get single demo user by ID
     * Demonstrates individual resource fetching
     */
    getDemoUser: builder.query<DemoUser, string>({
      query: (id) => `/api/demo/users/${id}`,
      providesTags: (result, error, id) => [{ type: "Demo", id }],
    }),

    /**
     * Create new demo user
     * Demonstrates optimistic updates and cache invalidation
     */
    createDemoUser: builder.mutation<DemoUser, Omit<DemoUser, "id" | "createdAt">>({
      query: (newUser) => ({
        url: "/api/demo/users",
        method: "POST",
        body: newUser,
      }),
      invalidatesTags: [{ type: "Demo", id: "USER_LIST" }],
      // Optimistic update
      async onQueryStarted(newUser, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          demoApi.util.updateQueryData("getDemoUsers", { page: 1, limit: 10 }, (draft) => {
            const optimisticUser: DemoUser = {
              ...newUser,
              id: `temp-${Date.now()}`,
              createdAt: new Date().toISOString(),
            }
            draft.data.unshift(optimisticUser)
          }),
        )
        try {
          await queryFulfilled
        } catch {
          patchResult.undo()
        }
      },
    }),

    /**
     * Update demo user
     * Demonstrates partial updates and cache synchronization
     */
    updateDemoUser: builder.mutation<DemoUser, { id: string } & Partial<DemoUser>>({
      query: ({ id, ...patch }) => ({
        url: `/api/demo/users/${id}`,
        method: "PATCH",
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Demo", id }],
      // Update cache immediately
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          demoApi.util.updateQueryData("getDemoUser", id, (draft) => {
            Object.assign(draft, patch)
          }),
        )
        try {
          await queryFulfilled
        } catch {
          patchResult.undo()
        }
      },
    }),

    /**
     * Delete demo user
     * Demonstrates cache removal and list updates
     */
    deleteDemoUser: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/api/demo/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Demo", id },
        { type: "Demo", id: "USER_LIST" },
      ],
    }),

    /**
     * Get demo posts with advanced filtering
     * Demonstrates complex query parameters and transformations
     */
    getDemoPosts: builder.query<
      PaginatedResponse<DemoPost>,
      {
        page?: number
        limit?: number
        author?: string
        status?: string
        tags?: string[]
        sortBy?: "createdAt" | "updatedAt" | "title"
        sortOrder?: "asc" | "desc"
      }
    >({
      query: (params) => {
        const searchParams = new URLSearchParams()
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) {
            if (Array.isArray(value)) {
              value.forEach((v) => searchParams.append(key, v))
            } else {
              searchParams.append(key, value.toString())
            }
          }
        })
        return `/api/demo/posts?${searchParams.toString()}`
      },
      providesTags: ["Demo"],
      // Transform response to add computed fields
      transformResponse: (response: PaginatedResponse<DemoPost>) => ({
        ...response,
        data: response.data.map((post) => ({
          ...post,
          excerpt: post.content.substring(0, 150) + "...",
          readTime: Math.ceil(post.content.length / 200), // Rough reading time
        })),
      }),
    }),

    /**
     * Bulk operations example
     * Demonstrates handling multiple operations
     */
    bulkUpdateDemoUsers: builder.mutation<
      { updated: number },
      {
        ids: string[]
        updates: Partial<DemoUser>
      }
    >({
      query: ({ ids, updates }) => ({
        url: "/api/demo/users/bulk",
        method: "PATCH",
        body: { ids, updates },
      }),
      invalidatesTags: [{ type: "Demo", id: "USER_LIST" }],
    }),
  }),
})

export const {
  useGetDemoUsersQuery,
  useGetDemoUserQuery,
  useCreateDemoUserMutation,
  useUpdateDemoUserMutation,
  useDeleteDemoUserMutation,
  useGetDemoPostsQuery,
  useBulkUpdateDemoUsersMutation,
  // Lazy queries for conditional fetching
  useLazyGetDemoUsersQuery,
  useLazyGetDemoUserQuery,
} = demoApi
