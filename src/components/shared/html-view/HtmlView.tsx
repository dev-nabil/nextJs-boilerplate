export default function HtmlView({ content }: { content: any }) {
  return <div className="html-view max-w-full overflow-hidden break-words" dangerouslySetInnerHTML={{ __html: content }} />
}
