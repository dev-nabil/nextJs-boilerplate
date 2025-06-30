import { Pathparams } from '@/types'
import { BlogCreateAndUpdate } from '../../_component/BlogCreateAndUpdate'

export default async function page({ params }: Pathparams) {
  const { id } = await params

  return <BlogCreateAndUpdate id={id} />
}
