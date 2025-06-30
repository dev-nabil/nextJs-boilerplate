import { api } from '@/store/api'

export const pnVerificationApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: builder => ({
    phoneVerification: builder.mutation({
      query: data => {
        return {
          url: `/verification/phone`,
          method: 'POST',
          body: data
        }
      },
      invalidatesTags: ['seller', 'User']
    }),
    phoneOtpVerify: builder.mutation({
      query: data => {
        return {
          url: `/verify/phone`,
          method: 'POST',
          body: data
        }
      },
      invalidatesTags: ['seller', 'User']
    })
  })
})

export const { usePhoneOtpVerifyMutation, usePhoneVerificationMutation } = pnVerificationApi
