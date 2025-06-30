import type React from "react"
import type { ContentType } from "@/app/(seller)/seller/profile/create-project/components/ProjectContentItem"
import type { Icons } from "@/components/custom/icons"
import type { AccessorColumnDef, ColumnDefBase, DisplayColumnDef, GroupColumnDef, RowData } from "@tanstack/react-table"
import type { ReactNode } from "react"

export enum UserRole {
  Buyer = "buyer",
  Seller = "seller",
  Admin = "admin",
}

export interface Pathparams {
  params: Promise<{ id: string }>
}

export interface User {
  id: string
  email: string
  name: string
  role: "admin" | "user"
  createdAt: string
  updatedAt: string
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface Session {
  token: string
  user: User
}

export interface Project {
  id: string
  title: string
  description: string
  budget: number
  status: "OPEN" | "IN_PROGRESS" | "COMPLETED"
  buyerId: string
  sellerId?: string
  createdAt: string
  updatedAt: string
}

export interface Service {
  id: string
  title: string
  description: string
  price: number
  sellerId: string
  category: string
  tags: string[]
  createdAt: string
  updatedAt: string
}

export interface NavItem {
  title: string
  href?: string
  disabled?: boolean
  external?: boolean
  icon?: keyof typeof Icons | string
  label?: string
  description?: string
}

export type searchParamsProps = {
  searchParams: {
    [key: string]: string | string[] | undefined
  }
}

export interface FormData {
  basicInfo: {
    name: string
  }
  jobDescription: string
  requirements: Array<{
    text: string
  }>
}

export type Statistics = {
  liveMatches?: number
}

export interface Payment {
  name: string
  amount: string
}

export interface NavItem {
  title: string
  href?: string
  disabled?: boolean
  external?: boolean
  icon?: keyof typeof Icons | string
  label?: string
  description?: string
}

export interface PaymentSectionProps {
  payments: Payment[]
  setPayments: (payments: Payment[]) => void
}
export interface StatCardProps {
  value: number
  suffix?: string
  description: string
  icon: File | string
}
export interface BackgroundImageWrapperProps {
  image: string
  children: ReactNode
  height?: string
  className?: string
  overlayClassName?: string
  overlay?: boolean
  opacity?: string
  childrenClass?: string
}
export interface CustomModalProps {
  open: boolean
  setOpen: (open: boolean) => void
  className?: string
  children: React.ReactNode
  title?: string
  description?: string
}
export type TIconCard = {
  title: string
  index?: number
  lastIndex?: number
  type: string
  description: string
  imgSrc?: string
  svg?: any
  customClass?: string
}

export type TJobCardProps = {
  title: string
  category?: any[]
  paymentVerified: boolean
  location: string
  rating: number
  isApplicant?: boolean
  budget: number | string
  details?: string
  createdAt: string
}

export interface JobDetailsProps {
  title: string
  type: "default" | "ongoing" | "completed" | "draft"
  location: string
  postedTime: string
  brief: string
  estimatedPrice: string
  duration: string
  categories: any[]
  clientDetails: {
    paymentVerified: boolean
    location: string
    memberSince: string
    reviews: number
    openJobs: number
  }
  onApply?: () => void
}

export type TPhotoGrapherProps = {
  coverImage: string
  userImage: string
  name: string
  location: string
  project: number | string
  rating: number | string
  customClass?: string
}

export interface ProfileCardProps {
  className?: string
}
export interface UserSettingsCardProps {
  id?: string
  name: string
  title: string
  imageSrc: string
  isOnline: boolean
  isBuyer: boolean
  onToggleOnline: () => void
  onToggleBuyer: () => void
  onLogout: () => void
}

export interface FeedsProps {
  image: string
  type?: "video" | "multiple" | "image"
  video?: string
  images?: string[]
}

export interface IAuthState {
  user?: IUser | undefined
}
export interface IUserRole {
  id: string
  name: string
}

export interface IUserAccess {
  id: string
  service: string
  operation?: string[]
}

export interface IUser {
  id: string
  name: string
  verified: boolean
  connects: number
  email: string
  password: string
  avatar?: string
  phone?: string
  emailVerified: boolean
  phoneVerified: boolean
  ipAddress?: string
  loginAttempts: number
  lockUntil: number
  inReview: boolean
  address?: IAddress
  nid?: string
  status: statusEnum
  reviewsRecieved?: number
  rating?: number
  lastActive?: number
  googleId?: string
  facebookId?: string
  appleId?: string
  role?: IUserRole
  provider: "email" | "facebook" | "google"
  aboutMe?: string
  seller?: ISeller
  buyer?: IBuyer
  createdAt: string
  blocked?: boolean
  reviewsReceived?: IReview[]
  completedProjects?: number
  ongoingProjectsCount?: number
  totalSpent?: number
}

export interface ISeller {
  id: string
  title: string
  description: string
  videoIntro?: string
  verified: boolean
  subscribed: boolean
  budget: number
  connects: number
  visitCount?: number
  escrowAmount?: number
  availableAmount?: number
  isTopRated: boolean
  subsEndDate?: string
  userId: string
  serviceType?: "photography" | "videography" | "both" | "all" | "editing"
  cover?: string
  socialMediaLinks?: string
  nid?: string
  nidFront?: string
  nidBack?: string
  verificationStatus?: "pending" | "complete" | "cancelled" | "not-applied" | "failed"
  user: IUser
  categories: ICategory[]
  experiences: IExperience[]
  certifications: ICertification[]
}

export interface IBuyer {
  id: string
  completedProjects?: number
  totalSpent?: number
  accountBalance?: number
  userId: string
  user: IUser
  ongoingProjectsCount: string | number
}

export interface ITalent {
  id: string
  rate: number
  intro: string
  description: string
  type: gigCategory
  escrowAmount?: number
  availableAmount?: number
  isTopRated: boolean
  free: boolean
}

export interface IAddress {
  id: string
  postal: number
  addressLine1: string
  addressLine2?: string
  city: string
  country: string
}

export interface IBookedDates {
  id: string
  from: Date
  to: Date
}

export interface IPersonalProjects {
  id: string
  name: string
  description: string
  cover: string
  images?: string[]
  videos?: string[]
  completedDate: Date
}

export interface ICategory {
  id: string
  name: string
  parentCategoryId: string | null
  parentCategory: ICategory
  position: number
  subCategories: object[]
  featured: boolean
  visible: boolean
}

export interface IExperience {
  id: string
  name: string
  position: string
  city: string
  website?: string
  yearsOfExperience: number
  sellerId: string
}

export interface ICertification {
  id: string
  title: string
  achievedDate: Date
  image: string
  imageType: string
}

export interface IReview {
  id: string
  rating: number
  comment: string
}

export interface ILocation {
  city: string
  country: string
}
export interface IProject {
  id: string
  title: string
  country: string
  city: string
  rating?: string | number
  fields: { name: string; level: string }
  description: string
  amount: number | string
  expertise: "entry" | "intermediate" | "expert"
  serviceType: "photography" | "videography" | "both" | "all" | "editing"
  boosted?: boolean
  boostAmount?: number
  from: Date
  to: Date
  status: projectStatus
  paymentType: paymentType
  category: ICategory
  options: string
  seller?: ISeller
  buyer: IBuyer
  hiredSellers?: ISeller[]
  createdAt: string
  location?: ILocation
}

export interface IConnection {
  id: string
  status: "pending" | "active" | "blocked" | "restricted"
  project: { title: string }
}

export type SubscriptionPlan = {
  id: string
  title: string
  price: number
  salePrice: number | null
  discount: number
  discountType: "flat" | "percentage"
  currency: string
  serviceLimit: number
  proBadge: boolean
  profileViewsDays: string
  socialExploreViews: boolean
  socialExploreInteractionViews: boolean
  socialExplorePerformanceTrends: boolean
  proposalShortlistStatus: boolean
  postNumberOfApplicants: boolean
  postBiddingInsights: boolean
  postTrends: boolean
  customAlerts: boolean
  buyerResponseTime: boolean
  advancedProfileAnalytics: boolean
  jobAlerts: boolean
  portfolioProjects: number
  connectsGranted: number
  duration: number
  durationType: string
  visible: boolean
  createdAt: string
}
export interface IProposal {
  id: string
  status: proposalStatus
  amount: number
  from: Date
  to: Date
  paymentType: paymentType
}

export interface INotification {
  id: string
  text: string
  image?: string
  created: Date
  notificationType?: "success" | "warning" | "error" | "bid"
}

export interface IOrder {
  id: string
  price: number
  status: orderStatus
}

export interface IMilestone {
  id: string
  number: number
  title: string
  date?: Date
  amount: number
}

export interface IFAQ {
  id: string
  question: string
  answer: string
}

export enum proposalStatus {
  PENDING = "pending",
  ACCEPTED = "accepted",
  REJECTED = "rejected",
}

export enum statusEnum {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

export enum orderStatus {
  PENDING = "pending",
  SUCCESS = "success",
  FAILED = "failed",
}

export enum durationType {
  DAILY = "daily",
  WEEKLY = "weekly",
  MONTHLY = "monthly",
  YEARLY = "yearly",
}

export enum projectStatus {
  DRAFT = "draft",
  PUBLISHED = "published",
  ONGOING = "ongoing",
  COMPLETED = "completed",
}

export enum gigType {
  BASIC = "basic",
  STANDARD = "standard",
  PREMIUM = "premium",
}

export enum gigCategory {
  PHOTOGRAPHY = "photography",
  CINEMATOGRAPHY = "cinematography",
  BOTH = "both",
}

export enum paymentType {
  PROJECT = "projectBased",
  MILESTONE = "milestoneBased",
}

export interface ICategory {
  id: string
  name: string
  fields?: any[]
}

export interface IUserInformation {
  id: string
  name: string
  email: string
  phone: string
  createdAt: string
  status: "active" | "inactive" | ""
  role: {
    id: string
    name: string
  }
  blocked?: boolean
}

export interface IBanner {
  id: string
  cta?: string
  cover?: string
  lottie?: string
  sideImage?: string
  title?: string
  description?: string
  ctaText?: string
}
export interface IBlog {
  id: string
  title?: string
  image?: string
  content?: string
}

export type TPageKey =
  | "category"
  | "notification"
  | "user"
  | "contact"
  | "subscription"
  | "banner"
  | "users"
  | "project"
  | "service"
  | "talent"
  | "proposal"
  | "contract"
  | "connection"
  | "buyer"
  | "seller"
  | "admin"
  | "settings"
  | "portfolio"
  | "certifications"
  | "milestone"
  | "faq"
  | "dispute"
  | "bill"
  | "withdraw"

export interface LimitFunctionProps {
  method: "GET" | "SET"
  key: TPageKey
  limit?: number
  setter?: (v: number) => void
}
export interface Iconnection {
  id: string
  visible: boolean
  createdAt: string
  sellerId: string
  buyerId: string
  projectId: string
  proposalId: any
  chatId: any
}

export interface modalProps {
  open: boolean
  openRegion: "view" | "rejected" | ""
  data: IUserInformation
}

export interface GroupColumnDefBase<TData extends RowData, TValue = unknown> extends ColumnDefBase<TData, TValue> {
  columns?: ColumnDef<TData, any>[]
  headClassName?: string
}

export type ColumnDef<TData extends RowData, TValue = unknown> =
  | DisplayColumnDef<TData, TValue>
  | GroupColumnDef<TData, TValue>
  | AccessorColumnDef<TData, TValue>
  | GroupColumnDefBase<TData, TValue>

export interface ContentItem {
  id: string
  type: ContentType
  content: string | File | { heading: string; content: string; format: "plain" | "markdown"; plainTextContent?: string }
  preview?: string
}

export interface ShareProjectFormProps {
  id?: string
  onSubmit?: (data: any) => Promise<void>
}

export interface SellerDataProps {
  user: {
    name: string
    avatar: string | null
    address: {
      country: string
    }
    rating: number
  }
  id: string

  title: string
  description: string
  rate: string
  _count: {
    contract: number
  }
  personalProjects: {
    title: string
    description: string
    visible: boolean
  }[]
}

export interface Milestone {
  id: string
  title: string
  date: Date | undefined | string
  amount: number
  bill?: PaymentRequest
  status: "not_started" | "active" | "due" | "submitted" | "completed"
}
// Update the interface to match the new data structure
export interface ProposalDetailsProps {
  contactDetails: {
    id: string
    amount?: string
    paymentType: "fixed" | "hourly" | "milestone"
    message?: string
    shortlist?: boolean
    status?: string
    createdAt?: string
    milestones?: Milestone[]
    connection?: {
      project?: {
        id: string
        title: string
        description: string
        fixedAmount: string
        minAmount: string
        maxAmount: string
        duration: number
        paymentType: "fixed" | "hourly" | "milestone"
        expertise: string
        city: string
        country: string
      }
      seller?: {
        id: string
        title?: string
        rate?: string
        user?: {
          name: string
          avatar: string
          email: string
          rating: number
          createdAt: string
        }
      }
      buyer?: {
        paymentVerified: boolean
        totalSpent: string
        completedProjects: number
        user: {
          name: string
          avatar: string
          email: string
          rating: number
          createdAt: string
        }
      }
    }
  }
}

export interface Buyer {
  id: string
  paymentVerified: boolean
  totalSpent: string
  completedProjects: number
  accountBalance: string
  ongoingProjectsCount: number
  userId: string
  visible: boolean
  createdAt: string
  user: {
    id: string
    name: string
    aboutMe: string | null
    role: {
      id: string
      name: string
      visible: boolean
      createdAt: string
    }
    avatar: string
    email: string
    phone: string | null
    provider: string
    emailVerified: boolean
    phoneVerified: boolean
    rating: number
    blocked: boolean
    status: string
    lastActive: string
    TwoFA: boolean
    emailNotification: boolean
    messageNotification: boolean
    createdAt: string
    address?: {
      id: string
      postal: number
      addressLine1: string
      addressLine2: string
      city: string
      country: string
      visible: boolean
      createdAt: string
    }
  }
}

export interface Connection {
  id: string
  visible: boolean
  createdAt: string
  sellerId: string
  buyerId: string
  projectId: string
  proposalId: string
  chatId: string | null
}

export interface PaymentRequest {
  id: string
  buyerId: string
  sellerId: string
  status: "pending" | "approved" | "rejected" | string // Extend as needed
  trxId: string | null
  amount: number
  payWithCash: boolean
  visible: boolean
  createdAt: string // ISO date string
  milestoneId: string | null
  contractId: string
  reqBySeller: boolean
  apprByBuyer: boolean
  paymentStatus: "pending" | "paid" | "failed" | string // Extend as needed
  released: boolean
}

export type TContractData = {
  id: string
  paymentType: string
  status: string
  amount: string
  visible: boolean
  createdAt: string
  sellerId: string
  buyerId: string
  projectId: string
  dispute: IDispute[]
  buyer: {
    id: string
    paymentVerified: boolean
    totalSpent: string
    completedProjects: number
    accountBalance: string
    ongoingProjectsCount: number
    userId: string
    visible: boolean
    createdAt: string
    user: {
      name: string
    }
  }
  project: {
    id: string
    title: string
    description: string
    fixedAmount: string
    minAmount: string
    maxAmount: string
    shortList: boolean
    duration: number
    published: boolean
    boosted: boolean
    boostAmount: string
    paymentType: string
    options: any
    status: string
    expertise: string
    city: string
    country: string
    buyerId: string
    visible: boolean
    createdAt: string
    sellerId: string | null
    categoryId: string
  }
  seller: {
    id: string
    title: string
    description: string
    cover: string
    videoIntro: string | null
    verified: boolean
    subscribed: boolean
    rate: string
    connects: number
    visitCount: number
    escrowAmount: string
    availableAmount: string
    totalEarned: string
    isTopRated: boolean
    subsEndDate: string | null
    socialMediaLinks: any
    nid: string
    nidFront: string
    nidBack: string
    verificationStatus: string
    verificationReason: string | null
    userId: string
    visible: boolean
    createdAt: string
    hiredSellerId: string | null
    user: {
      name: string
      avatar: string
      address: {
        id: string
        postal: string | null
        addressLine1: string
        addressLine2: string | null
        city: string
        country: string
        visible: boolean
        createdAt: string
      }
    }
    categories: Array<{
      id: string
      name: string
      featured: boolean
      visible: boolean
      position: number
      createdAt: string
      sellerId: string | null
      parentCategoryId: string | null
    }>
  }
  milestones: Array<{
    id: string
    title: string
    description: string
    amount: string
    status: string
    dueDate: string
    contractId: string
    visible: boolean
    createdAt: string
  }>
  bill?: PaymentRequest
}

export interface IReviews {
  id: string
  rating: number
  comment: string
  visible: boolean
  createdAt: string
  fromId: string
  toId: string
  projectId: string
  users_reviews_fromIdTousers: UsersReviewsFromIdTousers
  users_reviews_toIdTousers: UsersReviewsToIdTousers
  contractId: string
}

export interface UsersReviewsFromIdTousers {
  id: string
  name: string
  avatar: string
}

export interface UsersReviewsToIdTousers {
  id: string
  name: string
  avatar: string
}

export interface JobContractDetailsProps {
  role: "buyer" | "seller"
  contractId: string
  title: string
  status: "active" | "pending" | "ended" | "accepted"
  location: string
  description: string
  totalAmount: string
  category: string
  paymentDate?: string
  milestones?: Milestone[]
  paymentType: "hourly" | "milestoneBased" | "projectBased"
  userWithSellerInfo: {
    name: string
    bio: string
    avatarUrl: string
    id: string
    paymentVerified?: string
    totalSpent?: string
    completedProjects?: string
    ongoingProjectsCount?: string
  }
  toId: string
  projectId: string
  reviews: IReviews[]
  dispute?: IDispute[]
  bill?: PaymentRequest
}

export interface IDispute {
  id: string
  title: string
  description: string
  status: "pending" | "resolved" | "rejected"
  createdAt: string
  updatedAt: string
  chatId: string
  projectId: string
  buyerId: string
  sellerId: string
  raisedBy?: "seller" | "buyer"
}

export interface IMessage {
  id: string
  message?: string | null
  visible: boolean
  authorId?: string | null
  createdAt: string
  chatId: string
  author?: IUser
  attachments?: []
  chat?: IChat
  chatLastMessage?: IChat
  seens?: IUser[]
}
export interface IChat {
  id: string
  visible: boolean
  createdAt: string
  project: { title: string }
  updatedAt: string
  creatorId: string
  disputeId?: string | null
  lastMessageId?: string | null
  creator?: IUser
  dispute?: IDispute
  connection?: IConnection
  lastMessage: IMessage
  members?: IUser[]
  seens?: IUser[]
}

// notification interface
export type notificationCategoryProps =
  | "subscription" // Subscription plan buy success notification
  | "boost" // Profile boost
  | "connect" // Connect (if it's an actual type in your system)
  | "waiting_for_payment" // Waiting for buyer to pay (payment)
  | "payment_complete" // Payment has been released to the seller
  | "system" // System notification
  | "admin_release_payment" // Admin manually releases payment to seller
  | "proposal" // Buyer sends a proposal (project)
  | "decline" // Seller declines offer (project)
  | "decline_contract" // Seller declines contract (project)
  | "accept_contract" // Seller accepts the contract (project)
  | "payment_request" // Seller sends a payment request (payment)
  | "payment_release" // Buyer manually releases payment (payment)
  | "invite" // Buyer invites seller to a project (project)
  | "hire" // Buyer hires the seller (project)
  | "cancel_project" // Buyer cancels the project (project)
  | "payment_success" // Buyer completes payment
  | "bid" // Bid buy success notification
  | "withdrawal" // Profile balance withdrawal
  | "project_complete_confirmation" // Buyer confirms project complete
  | "review"

export type notificationType = "default" | "success" | "warning" | "error"

export interface IProposalData {
  proposalId: string
  projectId: string
  connectionId: string
  contractId: string
}

export interface INotificationProps {
  id: string
  category: notificationCategoryProps
  type: notificationType
  title: string
  message?: string
  createdAt: string
  read: boolean
  data?: IProposalData
}

// boost profile

export interface IBoostCount {
  boosts: number
}

export interface IBoostProfile {
  id: string
  verificationStatus: string
  createdAt: string
  _count: IBoostCount
  user: IUser
}

interface ConnectPurchases {
  id: string
  connects: number
  amount: string
  expiryDate: string // ISO date string
  duration: number
  durationType: "monthly" | "yearly" | string // Extendable if needed
  visible: boolean
  createdAt: string // ISO date string
  sellerId: string
}

export interface IBidPoint {
  id: string
  verificationStatus: string
  createdAt: string
  connectPurchases: ConnectPurchases
  user: IUser
}

// boost profile

export interface PriceSetting {
  minPrice: number
  maxPrice: number
}
