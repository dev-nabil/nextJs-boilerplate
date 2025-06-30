import UserProfileUploadImageForm from '@/components/Settings/UserProfileUploadImageForm'
import { RootState } from '@/store'
import { useSelector } from 'react-redux'
import UserInformationForm from './UserInformationForm'

const UserProfileInformation = () => {
  const { user }: any = useSelector((state: RootState) => state?.auth?.user)
  return (
    <div className="container mx-auto p-1 sm:p-6">
      <UserProfileUploadImageForm user={user} />
      <UserInformationForm />
    </div>
  )
}

export default UserProfileInformation
