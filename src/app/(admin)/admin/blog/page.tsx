import BreadCrumb from '@/components/shared/Breadcrumb'
import BlogTable from './_component/BlogTable'

export default function page() {
  const breadcrumbItems = [{ title: 'Blog', link: '/admin/blog' }]

  return (
    <div>
      <BreadCrumb items={breadcrumbItems} className="mt-6 ml-6" />
      <BlogTable />
    </div>
  )
}
