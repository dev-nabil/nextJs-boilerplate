'use client'

import VerificationMessage from '@/app/(auth)/varification/VerificationMessage'
import { getSubscriptionAccess } from '@/app/subscriptionAccess'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { sellerRoutes } from '@/routes/routes'
import { RootState } from '@/store'
import { useGetSingleOtherJobQuery } from '@/store/features/otherJob/otherJobApi'
import { IUser } from '@/types'
import { BadgeCheck, BadgeMinus, BriefcaseBusiness, CalendarDays, MapPin, Star } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import CustomModal from '../custom/CustomModal'
import JobNotFound from './JobNotFound'

type DetailSectionProps = {
  title: string
  value: string | number
  additionalClass?: string
}

type JobPostDetailsProps = {
  id?: string
  buyerId?: string
  title: string
  location: string
  postedTime: string
  brief?: string
  estimatedPrice: string | number
  expertise: string
  categoriesAndSubCategories: string[]
  isApplicant?: boolean
  proposalCount?: number
  invitationCount?: number
  clientDetails?: {
    paymentVerified: boolean
    city: string
    country: string
    rating: number
    memberSince: string
    reviews: number
    openJobs: number
  }
}

const DetailSection: React.FC<DetailSectionProps> = ({ title, value, additionalClass = '' }) => (
  <div className={cn('h-auto w-full rounded-lg bg-gray-50 p-6 text-center lg:w-[200px]', additionalClass)}>
    <p className="text-primary text-lg font-bold capitalize">
      {title === 'Estimated Price' && <span className="text-[14px] font-semibold text-[#71717A]">NPR</span>} {value}
    </p>
    <p className="text-sm text-gray-500">{title}</p>
  </div>
)

export default function JobPostDetails({
  title,
  id,
  buyerId,
  location,
  postedTime,
  brief,
  estimatedPrice,
  expertise,
  categoriesAndSubCategories,
  isApplicant,
  clientDetails,
  proposalCount,
  invitationCount
}: JobPostDetailsProps) {
  const { user }: any = useSelector((state: RootState) => state?.auth)
  const router = useRouter()
  const [showFullDescription, setShowFullDescription] = useState(false)
  const [open, setOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [page, setPage] = useState(1)
  const { data: singleOtherJob, isLoading: isLoadingSingleOtherJob } = useGetSingleOtherJobQuery(
    { id: buyerId || '', queries: { page } },
    { skip: !buyerId }
  )
  if (!id) {
    return <JobNotFound />
  }
  const handelApply = (user: IUser) => {
    if (user?.connects <= 0) {
      setOpen(true)
    } else if (!user?.verified) {
      setIsModalOpen(true)
    }
  }
  return (
    <div className="grid grid-cols-12 flex-col gap-6 pt-2 lg:flex-row">
      <div className="col-span-full border-r border-gray-200 bg-white md:col-span-8">
        <div className="pb-4">
          <h1 className="text-xl font-semibold lg:text-2xl">{title}</h1>
          <p className="mt-2 text-sm text-gray-500">
            Posted {postedTime} • {location}
          </p>
          <div className="mb-4 text-gray-600" />
          {brief && (
            <div className="whitespace-pre-line">{brief.length > 300 && !showFullDescription ? `${brief.slice(0, 300)}...` : brief}</div>
          )}
        </div>

        {brief && brief.length > 300 && (
          <button
            onClick={() => setShowFullDescription(!showFullDescription)}
            className="mb-3 flex items-center gap-1 text-sm font-medium text-blue-500 underline"
          >
            {showFullDescription ? 'Show Less' : 'View Details'}
          </button>
        )}

        <div className="col-span-1 flex w-full flex-col items-center justify-center gap-4 px-2 pb-6 lg:flex-row">
          <DetailSection title="Estimated Price" value={estimatedPrice} />
          <DetailSection title="Location" value={location} />
          <DetailSection title="Expertise" value={expertise} />
        </div>

        <div className="w-full border-t">
          <div className="flex flex-col items-center space-y-2 border-b py-8 md:items-start">
            <p className="text-base font-medium text-[#3F3F46]">
              Project Type : <span className="text-[#71717A]">Ongoing Project</span>
            </p>
            {getSubscriptionAccess()?.usageLimits.postNumberOfApplicants && (
              <>
                {proposalCount ? (
                  <p className="text-base font-medium text-[#3F3F46]">
                    Proposals: <span className="text-[#71717A]">{proposalCount}</span>
                  </p>
                ) : (
                  <></>
                )}
                {invitationCount ? (
                  <p className="text-base font-medium text-[#3F3F46]">
                    Invitations: <span className="text-[#71717A]">{invitationCount}</span>
                  </p>
                ) : (
                  <></>
                )}
              </>
            )}
          </div>

          <div className="flex flex-col items-center border-b py-8 md:items-start">
            <p className="text-lg font-medium text-[#3F3F46]">Skills and Expertise</p>
            <div className="mt-4 flex flex-wrap gap-3">
              {categoriesAndSubCategories.map((skill, index) => (
                <div key={index} className="rounded-sm bg-[#F7F7F7] px-2.5 py-0.5">
                  <p className="text-primary text-base font-semibold">{skill}</p>
                </div>
              ))}
            </div>
          </div>

          {/* <div className="flex flex-col items-center border-b py-8 md:items-start">
            <p className="text-lg font-medium text-[#3F3F46]">Client Recent History ({singleOtherJob?.totalDocs - 1 || 0})</p>
            <Link href="#">
              <p className="mt-4 text-base font-normal text-[#71717A] underline">Jobs in Process</p>
            </Link>
          </div> */}

          <div className="flex flex-col items-center border-b py-8 md:items-start md:border-none">
            {/* <p className="text-lg font-medium text-[#3F3F46]">Other open jobs by this client</p> */}
            <p className="text-lg font-medium text-[#3F3F46]">Client Recent History ({singleOtherJob?.totalDocs - 1 || 0})</p>
            {singleOtherJob && Array.isArray(singleOtherJob?.docs) && singleOtherJob.docs.length > 4 ? (
              <>
                {singleOtherJob.docs
                  .filter((item: any) => item.id !== id)
                  .map((item: any, idx: number) => (
                    <Link href={sellerRoutes.invitation(item?.id)} key={item?.id ?? idx}>
                      <p className="text-primary mt-4 text-base font-medium underline">{item?.title ?? 'Untitled Job'}</p>
                    </Link>
                  ))}
                {singleOtherJob.hasNextPage && (
                  <div className="mt-4 flex gap-2">
                    <Button variant="outline" disabled={page <= 1} onClick={() => setPage(prev => Math.max(prev - 1, 1))}>
                      Previous
                    </Button>
                    <Button variant="outline" disabled={!singleOtherJob.hasNextPage} onClick={() => setPage(prev => prev + 1)}>
                      Next
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <p className="mt-4 text-base text-gray-500">No other open jobs found.</p>
            )}
          </div>
        </div>
      </div>

      <div className="col-span-full md:col-span-4">
        <div className="w-full rounded-lg bg-white p-6">
          <div className="rounded-lg bg-gray-50 p-4">
            <div className="mb-4">
              <p className="text-sm text-gray-600">Send a Proposal for: 1 bid</p>
              <p className="text-base text-gray-800">Available Bids: {user?.connects || 0}</p>
            </div>
            {user && (
              <div className="w-full">
                {!user || user.connects <= 0 || !user.verified || isApplicant || !id ? (
                  <Button disabled={isApplicant || !id} onClick={() => handelApply(user as IUser)} className="w-full text-white">
                    Apply Now
                  </Button>
                ) : (
                  <Link
                    href={`/seller/find-work/submit-proposal/${id}`}
                    className="bg-primary hover:bg-primary/80 flex w-full flex-col rounded-md p-2 text-center text-sm text-white"
                  >
                    Apply Now
                  </Link>
                )}
              </div>
            )}
          </div>

          <div className="mt-6">
            <h2 className="mb-3 font-medium text-gray-800">About the Client</h2>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <span className="font-medium">
                  {clientDetails?.paymentVerified ? (
                    <span className="flex items-center gap-1">
                      <BadgeCheck size={20} className="text-green-600" /> Payment Verified
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <BadgeMinus size={20} /> Payment Not Verified
                    </span>
                  )}
                </span>
              </li>
              {clientDetails?.city && clientDetails.country && (
                <li className="flex items-center gap-1">
                  <MapPin size={20} /> {clientDetails.city} / {clientDetails.country}
                </li>
              )}
              <li className="flex items-center gap-2">
                <CalendarDays size={20} /> Member since {clientDetails?.memberSince}
              </li>
              <li className="flex items-center gap-2">
                <Star size={20} /> {clientDetails?.reviews} reviews
              </li>
              <li className="flex items-center gap-2">
                <BriefcaseBusiness size={20} /> {clientDetails?.openJobs} open jobs
              </li>
            </ul>
          </div>
        </div>
      </div>

      <CustomModal open={open} setOpen={setOpen} className="bg-primary max-w-xl border-none text-center">
        <div className="flex flex-col items-center gap-4 p-6">
          <div>
            <svg width={145} height={147} viewBox="0 0 145 147" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M137.451 120.367C140.303 122.018 137.356 123.942 138.164 126.894C138.984 129.892 139.762 132.39 138.089 135.294C136.417 138.199 134.26 140.92 131.262 141.707C128.309 142.481 124.273 142.901 121.421 141.25C118.729 139.691 117.654 136.479 116.775 133.727C115.777 130.603 112.711 128.239 114.475 125.174C116.239 122.11 122.861 117.552 126.058 116.857C128.874 116.244 134.758 118.808 137.451 120.367Z"
                fill="white"
                fillOpacity="0.05"
              />
              <path
                d="M142.658 96.9033C142.658 114.988 125.49 106.244 113.741 118.166C101.808 130.273 92.1243 140.813 73.8076 140.813C55.491 140.813 36.7185 138.005 24.7861 125.898C13.0371 113.976 0 95.9332 0 77.8482C0 60.7742 12.2487 46.8713 22.8583 35.1532C34.8997 21.8536 37.6832 0.796875 57.0081 0.796875C76.333 0.796875 116.02 19.8082 128.062 33.1078C138.671 44.826 142.658 79.8293 142.658 96.9033Z"
                fill="white"
                fillOpacity="0.11"
              />
              <g clipPath="url(#clip0_673_11953)">
                <path
                  d="M78.5943 77.5613C77.1266 80.7487 76.8176 84.373 76.9464 87.8688C77.0751 91.9044 77.7446 96.0172 79.7016 99.5901C81.6585 103.137 85.0317 106.068 89.0487 106.71C92.9111 107.327 96.928 105.759 99.7862 103.086C102.644 100.413 104.421 96.7369 105.4 92.9583C106.867 87.3033 106.533 80.9286 103.262 76.0961C97.3143 67.3309 83.152 67.7421 78.5943 77.5613Z"
                  fill="white"
                />
                <path
                  d="M104.06 93.036C103.21 96.3519 101.639 99.5649 99.1418 101.93C96.644 104.269 93.1164 105.657 89.7174 105.117C86.4987 104.603 83.7178 102.392 81.9668 99.6163C83.6405 101.467 85.8292 102.829 88.2754 103.215C91.6744 103.755 95.2021 102.392 97.6998 100.028C100.197 97.6885 101.768 94.4754 102.618 91.1595C103.854 86.3785 103.622 81.0062 101.047 76.8164C101.459 77.2534 101.845 77.7418 102.206 78.2816C105.064 82.4714 105.347 88.075 104.06 93.036Z"
                  fill="#E6E6E6"
                />
                <path
                  d="M90.7481 107.43C90.1301 107.43 89.5379 107.379 88.9199 107.276C85.006 106.633 81.3495 103.857 79.1608 99.8471C77.4099 96.6855 76.4829 92.7527 76.3284 87.8688C76.1739 83.4733 76.7146 80.106 78.0279 77.2785C80.1651 72.6774 84.5682 69.6957 89.8469 69.2587C95.4088 68.8217 100.713 71.2894 103.726 75.7105C106.816 80.2603 107.64 86.5836 105.966 93.0611C104.859 97.3795 102.85 100.978 100.172 103.471C97.4945 106.016 94.0698 107.43 90.7481 107.43ZM91.1601 70.4411C90.7739 70.4411 90.3619 70.4668 89.9756 70.4925C85.1347 70.8781 81.092 73.6285 79.1351 77.8183C77.8991 80.4659 77.4099 83.6533 77.5386 87.8688C77.6931 92.5727 78.5686 96.2999 80.2166 99.3073C82.2508 103.009 85.5725 105.554 89.1259 106.119C92.6021 106.685 96.4388 105.399 99.3742 102.649C101.872 100.31 103.752 96.8911 104.807 92.8041C106.404 86.6607 105.631 80.6972 102.747 76.4303C100.198 72.6517 95.8465 70.4411 91.1601 70.4411Z"
                  fill="#333333"
                />
                <path
                  d="M42.853 76.3021C40.7931 79.7722 39.8918 83.8335 39.5056 87.8691C38.9906 93.19 39.6343 99.2048 43.6255 102.778C48.1317 106.788 55.6763 105.939 60.1567 101.878C64.6372 97.8168 66.3624 91.4164 66.0534 85.3758C65.8474 81.2888 64.7402 77.1503 62.1395 73.9887C56.2428 66.8428 47.2562 68.9249 42.853 76.3021Z"
                  fill="white"
                />
                <path
                  d="M60.4412 100.697C60.364 100.774 60.261 100.851 60.1837 100.954C55.9865 104.732 48.9054 105.555 44.6825 101.776C40.923 98.4346 40.3308 92.8053 40.82 87.7929C41.1805 84.0143 42.0303 80.21 43.9615 76.9456C45.0945 75.0434 46.5622 73.5269 48.1844 72.4473C47.2574 73.3212 46.4335 74.3751 45.7125 75.5575C43.7812 78.822 42.9315 82.6263 42.571 86.4048C42.1075 91.4172 42.674 97.0465 46.4335 100.388C50.1929 103.73 56.1925 103.473 60.4412 100.697Z"
                  fill="#E6E6E6"
                />
                <path
                  d="M51.0165 106.017C48.1326 106.017 45.3259 105.091 43.2401 103.215C38.837 99.2822 38.4507 92.6761 38.9142 87.7923C39.3777 82.9598 40.4849 79.0784 42.3389 75.9682C44.7594 71.9069 48.6218 69.285 52.6902 68.9765C56.3982 68.6938 59.9259 70.3389 62.6296 73.5777C65.0243 76.508 66.4405 80.5693 66.6722 85.3246C67.0327 92.2906 64.8183 98.4597 60.5696 102.29C57.8659 104.783 54.364 106.017 51.0165 106.017ZM43.3689 76.6108C41.6179 79.5668 40.5364 83.2683 40.0987 87.9208C39.661 92.5219 39.9957 98.7424 44.0126 102.315C48.4673 106.274 55.7287 105.066 59.7456 101.441C63.7111 97.8685 65.7968 92.0335 65.4363 85.4275C65.2818 82.2915 64.4835 77.8189 61.6511 74.3745C59.2564 71.4442 56.0892 69.9533 52.7675 70.2104C49.111 70.4931 45.5834 72.8836 43.3689 76.6108Z"
                  fill="#333333"
                />
                <path
                  d="M55.4447 90.7234C56.0884 91.1089 56.9639 91.0832 57.6077 90.672C59.2041 89.6952 57.9682 87.5103 56.3974 87.4846C54.6207 87.4589 53.8997 89.798 55.4447 90.7234Z"
                  fill="#333333"
                />
                <path
                  d="M83.5635 90.3881C84.0527 90.6966 84.7222 90.6709 85.2372 90.3624C86.4732 89.617 85.5204 87.9205 84.2844 87.8948C82.9455 87.8691 82.379 89.6684 83.5635 90.3881Z"
                  fill="#333333"
                />
                <path
                  d="M64.483 37C64.895 38.4395 65.2297 39.9046 65.4872 41.3698C65.9507 43.8631 64.5345 46.3308 62.1397 47.2047C58.7408 48.4642 55.3934 49.878 51.8914 50.9319C48.441 51.9601 44.9133 53.0396 41.9263 55.0446C38.9394 57.0496 36.5447 60.2112 36.2872 63.8099C33.7122 59.7228 35.2315 54.2221 38.6562 50.8033C42.0808 47.3846 46.793 45.6624 51.3249 44.0173C55.8826 42.3723 61.187 40.5215 64.483 37Z"
                  fill="#333333"
                />
                <path
                  d="M78.5169 37C77.9504 39.005 77.5127 41.0356 77.2295 43.092C76.9977 44.66 77.9504 46.1765 79.4439 46.6906C83.3579 48.053 87.1173 49.7238 91.0827 50.9319C94.5332 51.9601 98.0608 53.0396 101.048 55.0446C104.035 57.0496 106.481 60.2112 106.713 63.8099C109.288 59.7228 107.768 54.2221 104.369 50.8033C100.945 47.3846 96.2326 45.6624 91.7007 44.0173C87.143 42.3723 81.8386 40.5215 78.5169 37Z"
                  fill="#333333"
                />
                <path
                  d="M84.3626 120.001H56.4758C56.141 120.001 55.8835 119.744 55.8835 119.41C55.8835 119.075 56.141 118.818 56.4758 118.818H84.3626C84.6973 118.818 84.9548 119.075 84.9548 119.41C84.9548 119.744 84.6973 120.001 84.3626 120.001Z"
                  fill="#333333"
                />
              </g>
              <defs>
                <clipPath id="clip0_673_11953">
                  <rect width={73} height={83} fill="white" transform="translate(35 37)" />
                </clipPath>
              </defs>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white">Oops!</h1>
          <p className="mt-2 text-white">
            Out of Bid Points? Don&#39;t worry! Unlock more with a subscription plan. Apply for your dream job without limits!
          </p>
          <div className="mt-4 flex flex-col items-center justify-center gap-2">
            <Link href={'/seller/bids'}>
              <Button className="text-primary-150 w-[150px] border bg-white hover:text-white">Buy Now</Button>
            </Link>
            <Button variant="outline" className="w-[150px]" onClick={() => setOpen(false)}>
              Later
            </Button>
          </div>
        </div>
      </CustomModal>
      <VerificationMessage open={isModalOpen} onClose={() => setIsModalOpen(false)} user={user} />
    </div>
  )
}
