import { cn } from "@/lib/utils"

interface HeadingProps {
  title: string
  description: string
  titleClass?: string
}

export const Heading: React.FC<HeadingProps> = ({ title, description, titleClass }) => {
  return (
    <div>
      <h2 className={cn(`text-3xl font-bold tracking-tight`, titleClass)}>{title}</h2>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  )
}
