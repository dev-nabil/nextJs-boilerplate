import { Icons } from '@/components/custom/icons'
import { Button } from '@/components/ui/button'
import { useSortable } from '@dnd-kit/sortable'

export default function DragHandler({ id }: { id: string }) {
  const { attributes, listeners } = useSortable({ id })

  return (
    <div className="flex items-center">
      <Button size="icon" variant="outline" {...attributes} {...listeners}>
        <Icons.grip className="h-7 w-7 text-muted-foreground" />
      </Button>
    </div>
  )
}
