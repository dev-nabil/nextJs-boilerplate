export default function ComingSoonNotice({
  title = 'Feature Coming Soon',
  message = `This feature is currently under development and will be available in the next update.
    Stay tuned!`
}) {
  return (
    <div className="mx-auto max-w-md rounded-md border border-dashed border-gray-300 bg-white px-4 py-10 text-center">
      <h2 className="mb-2 text-xl font-semibold text-gray-800">{title}</h2>
      <p className="text-sm text-gray-600">{message}</p>
    </div>
  )
}
