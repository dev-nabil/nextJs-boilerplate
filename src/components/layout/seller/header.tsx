import { sellerNavLinks } from '@/routes'
import Header from '../header'

export default async function SellerHeader() {
  return <Header links={sellerNavLinks} showSearch />
}
