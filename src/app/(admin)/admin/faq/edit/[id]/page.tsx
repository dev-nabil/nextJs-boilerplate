import BreadCrumb from '@/components/shared/Breadcrumb'
import { Pathparams } from '@/types'
import { CreateAndUpdateFaqForm } from '../../_components/CreateAndUpdateFaqForm'

const breadcrumbItems = [
  { title: 'Bid Points', link: '/admin/bid-points' },
  { title: 'Bid points plan edit', link: '/admin/bid-points/edit' }
]

export default async function page({ params }: Pathparams) {
  const { id } = await params
  return (
    <div>
      <BreadCrumb items={breadcrumbItems} />
      <div className="container mx-auto">
        <CreateAndUpdateFaqForm id={id} />
      </div>
    </div>
  )
}
