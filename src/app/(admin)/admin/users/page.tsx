import Users from "./components/Users"

export default async function Page(props: any) {
  const searchParams = await props.searchParams
  return <Users searchParams={searchParams} />
}
