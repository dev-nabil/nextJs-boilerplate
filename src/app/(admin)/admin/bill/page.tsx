import Bills from './components/Bills'

export default async function Page(props: any) {
  const searchParams = await props.searchParams
  return <Bills />
}
