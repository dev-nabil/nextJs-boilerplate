import { api } from '@/store/api'

export const forgetPassApi = api.injectEndpoints({
  overrideExisting: true, // Allow overriding existing endpoints
  endpoints: builder => ({
    requestPasswordReset: builder.mutation<any, { email: string }>({
      query: data => ({
        url: '/password/reset',
        method: 'POST',
        body: data
      })
    }),

    submitOTP: builder.mutation<any, { otp: string }>({
      query: data => ({
        url: '/submit/otp',
        method: 'POST',
        body: data
      })
    }),

    resetPassword: builder.mutation<any, { password: string }>({
      query: data => ({
        url: '/password/reset',
        method: 'PATCH',
        body: data
      })
    })
  })
})

export const { useRequestPasswordResetMutation, useSubmitOTPMutation, useResetPasswordMutation } = forgetPassApi
