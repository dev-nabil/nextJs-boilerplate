import Breadcrumb, { BreadcrumbItem } from '@/components/custom/breadcrumb'
import Loader from '@/components/custom/loader'
import { ReactNode } from 'react'

type Props = {
  children?: ReactNode
  loading?: boolean
  title: string
  body: ReactNode
  breadcrumbItems: BreadcrumbItem[]
}

export default function PageLayout({ children, loading, title, body, breadcrumbItems }: Props) {
  return (
    <div className="space-y-7 p-7">
      <div className="flex items-end justify-between">
        <div className="flex flex-col gap-1">
          <Breadcrumb items={breadcrumbItems} />
          <h2 className="text-3xl font-bold text-primary">{title}</h2>
        </div>

        <div className="flex gap-3">{children}</div>
      </div>

      <div>{loading ? <Loader /> : body}</div>
    </div>
  )
}
