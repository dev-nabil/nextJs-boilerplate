export default function SectionTitle({ title, details }: { title: string; details?: string }) {
  return (
    <h2 className="text-xl md:text-2xl lg:text-3xl my-10 px-2 lg:px-0">
      {title}
      {details && <p className="text-xs mt-2">{details}</p>}
    </h2>
  );
}
