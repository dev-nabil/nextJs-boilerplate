import BreadCrumb from '@/components/shared/Breadcrumb'
import { BlogCreateAndUpdate } from '../_component/BlogCreateAndUpdate'

export default function page() {
  const breadcrumbItems = [
    { title: 'Blog', link: '/admin/blog' },
    { title: 'Blog create', link: '/admin/blog/create' }
  ]

  return (
    <div>
      <BreadCrumb items={breadcrumbItems} />
      <BlogCreateAndUpdate />
    </div>
  )
}
