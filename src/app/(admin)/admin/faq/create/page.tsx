import BreadCrumb from '@/components/shared/Breadcrumb'
import { CreateAndUpdateFaqForm } from '../_components/CreateAndUpdateFaqForm'
// import { CreateAndUpdateBidPointsForm } from '../_components/CreateAndUpdateFaqForm'

const breadcrumbItems = [
  { title: 'FAQ Management', link: '/admin/faq' },
  { title: 'Create FAQ', link: '/admin/faq/create' }
]

export default function page() {
  return (
    <div>
      <BreadCrumb items={breadcrumbItems} />
      <div className="container mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">FAQ Management</h1>
          <p className="mt-2 text-gray-600">Create and manage frequently asked questions to help your users</p>
        </div>
        <CreateAndUpdateFaqForm />
      </div>
    </div>
  )
}
