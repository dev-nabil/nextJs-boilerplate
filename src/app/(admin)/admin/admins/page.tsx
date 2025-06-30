import AdminTable from "./components/AdminTable"

export default async function AdminsPage(props: any) {
  const searchParams = await props.searchParams
  return <AdminTable searchParams={searchParams} />
}
