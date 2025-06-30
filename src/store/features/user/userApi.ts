import socket from "@/lib/socket";
import { encodeBase64 } from "@/lib/utils";
import { api } from "@/store/api";
import { setCredentials } from "../auth/authSlice";
// import { setCredentials } from '../auth/authSlice'

export const userApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => {
        return {
          url: `/user/login`,
          method: "POST",
          body: data,
        };
      },
      onQueryStarted: async () => {
        socket.connect();
      },
    }),
    signup: builder.mutation({
      query: (data) => {
        return {
          url: `/user/signup`,
          method: "POST",
          body: data,
        };
      },
      onQueryStarted: async () => {
        socket.connect();
      },
    }),
    signupWithOtp: builder.mutation({
      query: (data) => {
        return {
          url: `/verification/email`,
          method: "POST",
          body: data,
        };
      },
      onQueryStarted: async () => {
        socket.connect();
      },
    }),
    verifyOtp: builder.mutation({
      query: (data) => {
        return {
          url: `/verify/email`,
          method: "POST",
          body: data,
        };
      },
    }),
    logout: builder.mutation({
      query: () => {
        return {
          url: "/user/signout",
          method: "POST",
        };
      },
      onQueryStarted: async () => {
        socket.disconnect();
      },
    }),
    getOwnProfile: builder.query({
      query: () => "/user/me",
      providesTags: ["User", "seller", "buyer"],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // user access permission stor local
          const permissionDataEncode = encodeBase64(data.accessLevels);
          localStorage.setItem("upa", permissionDataEncode ?? ""); // upa user permission access stor

          dispatch(setCredentials({ user: data }));
          // Store user data in localStorage
          const encodedData = encodeBase64(
            (data.sellerSubscriptions || []).map((sub: any) => ({
              ...sub,
              userId: data.user.id,
            }))
          );
          localStorage.setItem("usp", encodedData ?? ""); // usp user subscription packeg
        } catch (error) {
          console.log("Error getting profile:", error);
        }
      },
    }),
    updateOwnProfile: builder.mutation({
      query: (data) => {
        return {
          url: `/user/me`,
          method: "PATCH",
          body: data,
        };
      },
      invalidatesTags: ["User"],
    }),
    getUsers: builder.query({
      query: (queries) => {
        const values = Object.values(queries);
        if (values.length) return `/user/all?${new URLSearchParams(queries)}`;
        return "/user/all";
      },
      providesTags: ["User"],
    }),
    getSingleUser: builder.query({
      query: ({ id, role }: { id: string; role: string }) => `/${role}/${id}`,
      providesTags: ["User"],
    }),
    updateUser: builder.mutation({
      query: ({ id, data }) => {
        return {
          url: `/user/${id}`,
          method: "PATCH",
          body: data,
        };
      },
      invalidatesTags: ["User", "Admin"],
    }),
    updateRole: builder.mutation({
      query: (data) => {
        return {
          url: `/user/switch_role`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["User"],
    }),
    updateUserAddress: builder.mutation({
      query: (data) => {
        return {
          url: `/user/address`,
          method: "PATCH",
          body: data,
        };
      },
      invalidatesTags: ["User", "pending-verification"],
    }),
    updateAddress: builder.mutation({
      query: ({ id, data }) => {
        return {
          url: `/address/${id}`,
          method: "PATCH",
          body: data,
        };
      },
      invalidatesTags: ["User", "seller"],
    }),
    deleteUser: builder.mutation({
      query: (id) => {
        return {
          url: `/user/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["User"],
    }),
    requestEmailVerification: builder.query({
      query: () => "/verification/email",
    }),
    verifyEmail: builder.mutation({
      query: (data) => {
        return {
          url: `/verify/email`,
          method: "POST",
          body: data,
        };
      },
    }),
    requestPasswordReset: builder.mutation({
      query: (data) => {
        return {
          url: "/password/reset/request",
          method: "POST",
          body: data,
        };
      },
    }),
    submitOTP: builder.mutation({
      query: (data) => {
        return {
          url: "/submit/otp",
          method: "POST",
          body: data,
        };
      },
    }),

    resetPassword: builder.mutation({
      query: (data) => {
        return {
          url: `/password/reset`,
          method: "PATCH",
          body: data,
        };
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useDeleteUserMutation,
  useLazyGetOwnProfileQuery,
  useGetSingleUserQuery,
  useGetUsersQuery,
  useLogoutMutation,
  useUpdateUserAddressMutation,
  useRequestEmailVerificationQuery,
  useRequestPasswordResetMutation,
  useResetPasswordMutation,
  useSignupMutation,
  useSubmitOTPMutation,
  useUpdateOwnProfileMutation,
  useUpdateUserMutation,
  useVerifyEmailMutation,
  useUpdateAddressMutation,
  useSignupWithOtpMutation,
  useVerifyOtpMutation,
  useUpdateRoleMutation,
} = userApi;
